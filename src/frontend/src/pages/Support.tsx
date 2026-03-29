import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Mail, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const FAQ = [
  {
    q: "How do I deposit credits?",
    a: "Click the Deposit button in the header and enter the amount you wish to add.",
  },
  {
    q: "How are winnings calculated?",
    a: "Winnings = Stake × Odds. Your potential payout is shown in the Bet Slip before you confirm.",
  },
  {
    q: "How do I withdraw my winnings?",
    a: "Withdrawals are processed automatically when your balance updates after a won bet.",
  },
  {
    q: "What is responsible gambling?",
    a: "We encourage setting deposit limits and taking breaks. Our 18+ policy is strictly enforced.",
  },
];

export default function Support() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">Support</h1>
        <p className="text-muted-foreground text-sm mb-8">
          How can we help you today?
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact options */}
          <div className="space-y-4">
            {[
              {
                icon: MessageCircle,
                title: "Live Chat",
                desc: "Available 24/7",
                cta: "Start Chat",
              },
              {
                icon: Mail,
                title: "Email Support",
                desc: "support@winsport.ai",
                cta: "Send Email",
              },
              {
                icon: Phone,
                title: "Phone Support",
                desc: "+1 (800) WIN-SPORT",
                cta: "Call Now",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl card-shadow border border-border p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-brand/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-emerald-brand" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-foreground">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.desc}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  {item.cta}
                </Button>
              </div>
            ))}

            {/* FAQ */}
            <div className="bg-white rounded-xl card-shadow border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                  <FileText className="h-4 w-4" /> FAQ
                </h2>
              </div>
              <div className="divide-y divide-border">
                {FAQ.map((item) => (
                  <div key={item.q} className="px-4 py-3">
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {item.q}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-xl card-shadow border border-border p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input data-ocid="support.name.input" placeholder="Your name" />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  data-ocid="support.email.input"
                  type="email"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-1">
                <Label>Message</Label>
                <Textarea
                  data-ocid="support.message.textarea"
                  placeholder="Describe your issue..."
                  rows={4}
                />
              </div>
              <Button
                data-ocid="support.submit.button"
                type="submit"
                className="w-full bg-emerald-brand hover:bg-emerald-light text-white border-0"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
