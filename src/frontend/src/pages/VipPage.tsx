import { Headphones, Shield, Star, TrendingUp, Trophy } from "lucide-react";
import { motion } from "motion/react";

const tiers = [
  {
    name: "Bronze",
    color: "oklch(0.65 0.12 50)",
    border: "oklch(0.55 0.12 50)",
    glow: "rgba(180,100,30,0.35)",
    icon: "🥉",
    minDeposit: "PKR 5,000",
    benefits: [
      "3% Cashback",
      "Weekly Bonus PKR 500",
      "Email Support",
      "Standard Withdrawals",
    ],
    featured: false,
  },
  {
    name: "Silver",
    color: "oklch(0.75 0.04 265)",
    border: "oklch(0.60 0.05 265)",
    glow: "rgba(130,140,160,0.3)",
    icon: "🥈",
    minDeposit: "PKR 25,000",
    benefits: [
      "5% Cashback",
      "Weekly Bonus PKR 2,000",
      "Priority Email",
      "Faster Withdrawals",
    ],
    featured: false,
  },
  {
    name: "Gold",
    color: "oklch(0.82 0.18 85)",
    border: "oklch(0.72 0.18 85)",
    glow: "rgba(220,180,30,0.4)",
    icon: "👑",
    minDeposit: "PKR 100,000",
    benefits: [
      "8% Cashback",
      "Weekly Bonus PKR 8,000",
      "Live Chat Support",
      "2x Withdrawal Limits",
    ],
    featured: true,
  },
  {
    name: "Platinum",
    color: "oklch(0.72 0.15 195)",
    border: "oklch(0.60 0.15 195)",
    glow: "rgba(30,180,200,0.3)",
    icon: "💎",
    minDeposit: "PKR 250,000",
    benefits: [
      "12% Cashback",
      "Weekly Bonus PKR 20,000",
      "Dedicated Manager",
      "5x Withdrawal Limits",
    ],
    featured: false,
  },
  {
    name: "Diamond",
    color: "oklch(0.65 0.22 330)",
    border: "oklch(0.55 0.22 330)",
    glow: "rgba(200,30,180,0.35)",
    icon: "💠",
    minDeposit: "PKR 500,000",
    benefits: [
      "20% Cashback",
      "Weekly Bonus PKR 50,000",
      "VIP Account Manager",
      "Unlimited Withdrawals",
    ],
    featured: false,
  },
];

const benefits = [
  {
    icon: <Headphones size={28} />,
    title: "Personal Account Manager",
    desc: "Your dedicated VIP manager is available 24/7 to assist with anything you need.",
    accent: "oklch(0.72 0.15 195)",
  },
  {
    icon: <Trophy size={28} />,
    title: "Exclusive Tournaments",
    desc: "Compete in high-stakes VIP-only tournaments with massive prize pools.",
    accent: "oklch(0.82 0.18 85)",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Higher Withdrawal Limits",
    desc: "Enjoy premium withdrawal limits up to 10x the standard player allowance.",
    accent: "oklch(0.65 0.17 155)",
  },
  {
    icon: <Shield size={28} />,
    title: "Priority Support",
    desc: "Skip the queue. VIP players get instant priority access to our support team.",
    accent: "oklch(0.65 0.22 330)",
  },
];

const steps = [
  {
    num: 1,
    title: "Create Your Account",
    desc: "Sign up and complete your profile with verified details.",
    color: "oklch(0.65 0.22 330)",
  },
  {
    num: 2,
    title: "Make a Deposit",
    desc: "Fund your account via JazzCash, Easypaisa, or bank transfer.",
    color: "oklch(0.72 0.15 195)",
  },
  {
    num: 3,
    title: "Climb the Tiers",
    desc: "Your tier upgrades automatically based on your total deposits.",
    color: "oklch(0.82 0.18 85)",
  },
];

export default function VipPage() {
  return (
    <div
      style={{
        background: "oklch(0.13 0.08 280)",
        minHeight: "100vh",
        color: "oklch(0.95 0.01 280)",
      }}
    >
      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(160deg, oklch(0.15 0.09 280) 0%, oklch(0.18 0.10 300) 50%, oklch(0.16 0.10 260) 100%)",
          borderBottom: "1px solid oklch(0.28 0.06 275)",
          padding: "80px 24px 72px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: 350,
              height: 350,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.65 0.22 330 / 0.15) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20%",
              right: "8%",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.72 0.15 195 / 0.12) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "40%",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.82 0.18 85 / 0.1) 0%, transparent 70%)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={22}
                fill="oklch(0.82 0.18 85)"
                color="oklch(0.82 0.18 85)"
              />
            ))}
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              background:
                "linear-gradient(135deg, oklch(0.65 0.22 330) 0%, oklch(0.82 0.18 85) 40%, oklch(0.72 0.15 195) 70%, oklch(0.65 0.22 330) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            ⭐ VIP Club
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "oklch(0.75 0.04 280)",
              maxWidth: 540,
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            Exclusive Rewards for Our Most Loyal Players. The more you play, the
            more you earn.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button
                type="button"
                data-ocid="vip.join.primary_button"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.22 330), oklch(0.72 0.15 195))",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1rem",
                  padding: "14px 36px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px oklch(0.65 0.22 330 / 0.5)",
                }}
              >
                Join VIP Now
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button
                type="button"
                data-ocid="vip.learn.secondary_button"
                style={{
                  background: "transparent",
                  color: "oklch(0.82 0.18 85)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  padding: "14px 36px",
                  borderRadius: 8,
                  border: "1.5px solid oklch(0.82 0.18 85 / 0.6)",
                  cursor: "pointer",
                }}
              >
                Learn More
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Tiers */}
      <section
        style={{ padding: "64px 24px", maxWidth: 1280, margin: "0 auto" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              background:
                "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.65 0.22 330))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 8,
            }}
          >
            VIP Tiers
          </h2>
          <p style={{ color: "oklch(0.65 0.04 280)", fontSize: "1rem" }}>
            Progress through 5 exclusive tiers and unlock greater rewards
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              data-ocid={`vip.tier.item.${i + 1}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ translateY: -6 }}
              style={{
                background: tier.featured
                  ? "oklch(0.20 0.10 290)"
                  : "oklch(0.18 0.07 275)",
                border: `1.5px solid ${tier.featured ? tier.color : "oklch(0.28 0.06 275)"}`,
                borderRadius: 16,
                padding: "28px 20px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow: tier.featured ? `0 4px 24px ${tier.glow}` : "none",
              }}
            >
              {tier.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "oklch(0.82 0.18 85)",
                    color: "oklch(0.15 0.08 280)",
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 100,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Most Popular
                </div>
              )}
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>
                {tier.icon}
              </div>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: tier.color,
                  marginBottom: 4,
                }}
              >
                {tier.name}
              </h3>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "oklch(0.55 0.04 280)",
                  marginBottom: 16,
                }}
              >
                Min. Deposit: {tier.minDeposit}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 20px",
                  textAlign: "left",
                }}
              >
                {tier.benefits.map((b) => (
                  <li
                    key={b}
                    style={{
                      fontSize: "0.78rem",
                      color: "oklch(0.82 0.02 280)",
                      padding: "4px 0",
                      borderBottom: "1px solid oklch(0.25 0.05 275)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ color: tier.color, fontSize: "0.9rem" }}>
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                data-ocid={`vip.tier.join.button.${i + 1}`}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 8,
                  border: `1.5px solid ${tier.color}`,
                  background: tier.featured ? tier.color : "transparent",
                  color: tier.featured ? "white" : tier.color,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Join {tier.name}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section
        style={{
          background: "oklch(0.16 0.08 285)",
          padding: "64px 24px",
          borderTop: "1px solid oklch(0.28 0.06 275)",
          borderBottom: "1px solid oklch(0.28 0.06 275)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, oklch(0.72 0.15 195), oklch(0.65 0.22 330))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 8,
              }}
            >
              VIP Benefits
            </h2>
            <p style={{ color: "oklch(0.65 0.04 280)", fontSize: "1rem" }}>
              Everything you get when you join the inner circle
            </p>
          </motion.div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 24,
            }}
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                data-ocid={`vip.benefit.item.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: "oklch(0.18 0.07 275)",
                  border: "1px solid oklch(0.28 0.06 275)",
                  borderRadius: 16,
                  padding: "28px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: `${b.accent}20`,
                    color: b.accent,
                    marginBottom: 16,
                  }}
                >
                  {b.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "oklch(0.95 0.01 280)",
                    marginBottom: 8,
                  }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "oklch(0.65 0.04 280)",
                    lineHeight: 1.6,
                  }}
                >
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section
        style={{
          padding: "64px 24px",
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              background:
                "linear-gradient(135deg, oklch(0.65 0.17 155), oklch(0.72 0.15 195))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 8,
            }}
          >
            How to Join VIP
          </h2>
          <p
            style={{
              color: "oklch(0.65 0.04 280)",
              fontSize: "1rem",
              marginBottom: 48,
            }}
          >
            Three simple steps to unlock your VIP status
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 32,
            }}
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                data-ocid={`vip.step.item.${i + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: s.color,
                    color: "white",
                    fontWeight: 900,
                    fontSize: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 16px ${s.color}60`,
                  }}
                >
                  {s.num}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "oklch(0.95 0.01 280)",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "oklch(0.65 0.04 280)",
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ marginTop: 52 }}
          >
            <button
              type="button"
              data-ocid="vip.cta.primary_button"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.22 330), oklch(0.72 0.15 195), oklch(0.82 0.18 85))",
                color: "white",
                fontWeight: 800,
                fontSize: "1.05rem",
                padding: "16px 48px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 24px oklch(0.65 0.22 330 / 0.4)",
              }}
            >
              🌟 Claim Your VIP Status
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer note */}
      <div
        style={{
          borderTop: "1px solid oklch(0.28 0.06 275)",
          padding: "20px 24px",
          textAlign: "center",
          color: "oklch(0.50 0.04 280)",
          fontSize: "0.78rem",
        }}
      >
        VIP status is automatically assigned based on total lifetime deposits.
        Terms and conditions apply.
      </div>
    </div>
  );
}
