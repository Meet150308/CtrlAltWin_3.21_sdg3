import { 
  ShieldCheck, 
  Wind, 
  Stethoscope, 
  AlertTriangle,
  HeartPulse,
  Baby,
  PersonStanding
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const DISEASES = [
  {
    title: "Asthma",
    description: "Inflammation of airways causing wheezing, breathlessness, chest tightness, and coughing.",
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness"],
    risk: "High"
  },
  {
    title: "COPD",
    description: "Chronic Obstructive Pulmonary Disease blocks airflow and makes it difficult to breathe.",
    symptoms: ["Chronic cough", "Mucus production", "Fatigue"],
    risk: "High"
  },
  {
    title: "Lung Infection",
    description: "Particulates can damage lung tissue and increase susceptibility to bacterial and viral infections.",
    symptoms: ["Fever", "Coughing", "Chest pain"],
    risk: "Moderate"
  }
];

const PRECAUTIONS = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
    title: "Wear N95 Masks",
    text: "Standard cloth masks don't filter PM2.5 particles effectively. Use N95 or N99 masks outdoors."
  },
  {
    icon: <Wind className="w-6 h-6 text-blue-500" />,
    title: "Use Air Purifiers",
    text: "Keep indoor air clean with HEPA filter air purifiers, especially during peak pollution hours."
  },
  {
    icon: <PersonStanding className="w-6 h-6 text-orange-500" />,
    title: "Limit Outdoor Exercise",
    text: "Avoid morning jogs or strenuous outdoor activities when AQI levels are high."
  },
  {
    icon: <Baby className="w-6 h-6 text-purple-500" />,
    title: "Protect Vulnerable Groups",
    text: "Children, elderly, and those with existing conditions should stay indoors."
  }
];

export default function HealthGuide() {
  return (
    <div className="p-6 md:p-8 space-y-12 max-w-5xl mx-auto">
      <motion.div 
        className="text-center space-y-4 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <Stethoscope className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
          Health & Prevention
        </h1>
        <p className="text-lg text-muted-foreground">
          Understanding the impact of air pollution on your respiratory health and how to stay safe.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-display font-bold">Associated Risks</h2>
          </div>
          
          <div className="space-y-4">
            {DISEASES.map((disease, idx) => (
              <motion.div 
                key={disease.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {disease.title}
                      <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-full dark:bg-red-900/30 dark:text-red-300">
                        {disease.risk} Risk
                      </span>
                    </CardTitle>
                    <CardDescription>{disease.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {disease.symptoms.map(sym => (
                        <span key={sym} className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground font-medium">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-display font-bold">Prevention Guide</h2>
          </div>

          <div className="grid gap-4">
            {PRECAUTIONS.map((item, idx) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <div className="p-3 bg-background rounded-lg shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
