import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // ******** TYPES ********
  module Bet {
    public type Status = { #active; #won; #lost; #cancelled };
    public func compare(bet1 : Bet, bet2 : Bet) : Order.Order {
      Nat.compare(bet1.id, bet2.id);
    };
  };
  type Bet = {
    id : Nat;
    user : Principal;
    eventId : Nat;
    selectionId : Nat;
    stake : Float;
    potentialPayout : Float;
    status : Bet.Status;
  };

  module Event {
    public type Status = { #upcoming; #live; #closed; #settled };
    public func compare(event1 : Event, event2 : Event) : Order.Order {
      Nat.compare(event1.id, event2.id);
    };
    public func compareByStartTime(event1 : Event, event2 : Event) : Order.Order {
      Int.compare(event1.startTime, event2.startTime);
    };
  };

  type Event = {
    id : Nat;
    title : Text;
    description : Text;
    sport : Text;
    startTime : Time.Time;
    status : Event.Status;
    selections : [Selection];
    winningSelection : ?Nat;
  };

  module Selection {
    public func compare(selection1 : Selection, selection2 : Selection) : Order.Order {
      Nat.compare(selection1.id, selection2.id);
    };
  };

  type Selection = {
    id : Nat;
    name : Text;
    odds : Float;
  };

  module UserAccount {
    public func compare(userAccount1 : UserAccount, userAccount2 : UserAccount) : Order.Order {
      Principal.compare(userAccount1.user, userAccount2.user);
    };
  };

  type UserAccount = {
    user : Principal;
    balance : Float;
    totalWagered : Float;
    totalWon : Float;
    totalLost : Float;
  };

  // ******** STATE ********
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Store state in persistent maps to allow querying empty state
  let events = Map.empty<Nat, Event>();
  let bets = Map.empty<Nat, Bet>();
  let users = Map.empty<Principal, UserAccount>();

  var eventIdCounter = 0;
  var betIdCounter = 0;
  var selectionIdCounter = 0;

  // ******** HELPER FUNCTIONS ********

  func getUserAccountInternal(caller : Principal) : UserAccount {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User has no account") };
      case (?account) { account };
    };
  };

  func ensureBalance(user : UserAccount, amount : Float) {
    if (user.balance < amount) {
      Runtime.trap("Insufficient balance");
    };
  };

  func settleBetInternal(betId : Nat, status : Bet.Status) : () {
    switch (bets.get(betId)) {
      case (null) { Runtime.trap("Bet not found") };
      case (?existingBet) {
        let updatedBet : Bet = {
          existingBet with
          status;
        };
        bets.add(betId, updatedBet);
      };
    };
  };

  func updateUserBalanceInternal(user : Principal, amount : Float) : () {
    let userAccount = getUserAccountInternal(user);
    let newBalance = userAccount.balance + amount;
    if (newBalance < 0) {
      Runtime.trap("Insufficient balance");
    };
    let updated : UserAccount = {
      userAccount with
      balance = newBalance;
    };
    users.add(user, updated);
  };

  // ******** BETTING MARKET FUNCTIONS ********
  public shared ({ caller }) func createEvent(title : Text, description : Text, sport : Text, startTime : Time.Time, selections : [Selection]) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };
    let eventId = eventIdCounter;
    eventIdCounter += 1;

    let eventSelections = selections.map(func(s) { { s with id = selectionIdCounter + s.id } });
    selectionIdCounter += selections.size();

    let event : Event = {
      id = eventId;
      title;
      description;
      sport;
      startTime;
      status = #upcoming;
      selections = eventSelections;
      winningSelection = null;
    };

    events.add(eventId, event);
    eventId;
  };

  public shared ({ caller }) func updateEventStatus(eventId : Nat, status : Event.Status) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update event status");
    };
    let updatedEvent = switch (events.get(eventId)) {
      case (null) { Runtime.trap("Invalid event id: " # eventId.toText()) };
      case (?existing) {
        {
          existing with
          status;
        };
      };
    };
    events.add(eventId, updatedEvent);
  };

  public shared ({ caller }) func cancelEvent(eventId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can cancel events");
    };
    let event = switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?existing) { existing };
    };

    // Refund all active bets
    bets.values().forEach(
      func(bet) {
        if (bet.eventId == eventId and bet.status == #active) {
          // Refund user
          updateUserBalanceInternal(bet.user, bet.stake);
          // Mark bet as cancelled
          settleBetInternal(bet.id, #cancelled);
        };
      }
    );

    // Remove event from map
    events.remove(eventId);
  };

  public shared ({ caller }) func settleEvent(eventId : Nat, winningSelectionId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can settle events");
    };
    let updatedEvent = switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { { event with winningSelection = ?winningSelectionId } };
    };
    events.add(eventId, updatedEvent);
    // Settle all bets for this event
    bets.values().forEach(
      func(bet) {
        if (bet.eventId == eventId and bet.status == #active) {
          if (bet.selectionId == winningSelectionId) {
            // Mark bet as won
            settleBetInternal(bet.id, #won);
            // Update user balance
            updateUserBalanceInternal(bet.user, bet.potentialPayout);
            // Update stats
            let userAccount = getUserAccountInternal(bet.user);
            users.add(
              bet.user,
              {
                userAccount with
                totalWon = userAccount.totalWon + bet.potentialPayout;
              },
            );
          } else {
            settleBetInternal(bet.id, #lost);
            // Update stats
            let userAccount = getUserAccountInternal(bet.user);
            users.add(
              bet.user,
              {
                userAccount with
                totalLost = userAccount.totalLost + bet.stake;
              },
            );
          };
        };
      }
    );
  };

  // ******** USER FUNCTIONS ********
  // Function to deposit credits into account
  public shared ({ caller }) func depositCredits(amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit credits");
    };
    let amountRounded = Float.floor(amount * 100.0) / 100.0;
    if (amountRounded <= 0.0) { Runtime.trap("Amount must be positive") };

    // Check account existence and update or create
    switch (users.get(caller)) {
      case (null) {
        let newUser : UserAccount = {
          user = caller;
          balance = amountRounded;
          totalWagered = 0.0;
          totalWon = 0.0;
          totalLost = 0.0;
        };
        users.add(caller, newUser);
      };
      case (?user) {
        let newBalance = user.balance + amountRounded;
        if (newBalance < 0) {
          Runtime.trap("Insufficient balance");
        };
        users.add(caller, { user with balance = newBalance });
      };
    };
  };

  public shared ({ caller }) func placeBet(eventId : Nat, selectionId : Nat, stake : Float) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place bets");
    };
    if (stake < 0.01) { Runtime.trap("Minimum stake is 0.01 credits") };
    let event = switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };

    if (event.status == #settled or event.status == #closed) {
      Runtime.trap("This event is not accepting new bets");
    };

    // Confirm valid selection
    let validSelection = event.selections.find(
      func(sel) { sel.id == selectionId }
    );
    let selected = switch (validSelection) {
      case (null) { Runtime.trap("Selection does not exist") };
      case (?selected) { selected };
    };

    // Check user balance
    let userAccount = getUserAccountInternal(caller);
    ensureBalance(userAccount, stake);

    // Calculate potential payout
    let potentialPayout = stake * selected.odds;

    // Deduct stake from balance
    updateUserBalanceInternal(caller, -stake);

    // Create bet
    let betId = betIdCounter;
    betIdCounter += 1;

    let bet : Bet = {
      id = betId;
      user = caller;
      eventId;
      selectionId;
      stake;
      potentialPayout;
      status = #active;
    };
    bets.add(betId, bet);

    // Update user account stats
    users.add(
      caller,
      {
        userAccount with
        totalWagered = userAccount.totalWagered + stake;
      },
    );
    betId;
  };

  // ******** QUERY FUNCTIONS ********
  public query ({ caller }) func getActiveMarkets() : async [Event] {
    events.values().toArray().filter(
      func(event) {
        switch (event.status) {
          case (#upcoming) { true };
          case (#live) { true };
          case (_) { false };
        };
      }
    ).sort(Event.compareByStartTime);
  };

  public query ({ caller }) func getMyBets() : async [Bet] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    bets.values().toArray().filter(
      func(bet) { bet.user == caller }
    ).sort();
  };

  public query ({ caller }) func getMyBalance() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    return getUserAccountInternal(caller).balance;
  };

  public query ({ caller }) func getMyAccountSummary() : async UserAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
    return getUserAccountInternal(caller);
  };

  public query ({ caller }) func getEvent(eventId : Nat) : async Event {
    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) { event };
    };
  };
};
