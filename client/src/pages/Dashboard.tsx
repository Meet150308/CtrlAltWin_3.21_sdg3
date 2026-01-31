import { useAirQualityList } from "@/hooks/use-air-quality";
import { StatCard } from "@/components/StatCard";
import { AQIChart } from "@/components/AQIChart";
import { Wind, Activity, ThermometerSun, Droplets } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: readings, isLoading } = useAirQualityList();

  const averageAqi = readings 
    ? Math.round(readings.reduce((acc, curr) => acc + curr.aqi, 0) / readings.length) 
    : 0;

  const dominantPollutant = "PM2.5"; // Computed or mocked
  
  const getStatus = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "success" as const };
    if (aqi <= 100) return { label: "Moderate", color: "warning" as const };
    return { label: "Unhealthy", color: "destructive" as const };
  };

  const status = getStatus(averageAqi);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-8">
        <Skeleton className="h-12 w-48 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Real-time air quality monitoring for Nagpur, MH.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        <StatCard
          title="Average AQI"
          value={averageAqi}
          subtitle={status.label}
          color={status.color}
          icon={<Wind className={status.color === 'success' ? 'text-green-600' : status.color === 'warning' ? 'text-amber-600' : 'text-red-600'} />}
          trend="down"
          trendValue="12% vs yesterday"
        />
        <StatCard
          title="Main Pollutant"
          value={dominantPollutant}
          subtitle="Fine Particulate Matter"
          icon={<Activity className="text-blue-500" />}
          color="default"
        />
        <StatCard
          title="Temperature"
          value="32°C"
          subtitle="Feels like 35°C"
          icon={<ThermometerSun className="text-orange-500" />}
          color="default"
        />
        <StatCard
          title="Humidity"
          value="65%"
          subtitle="Moderate"
          icon={<Droplets className="text-cyan-500" />}
          color="default"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AQIChart />
        
        <div className="col-span-1 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-display font-bold text-2xl mb-2">Health Tip</h3>
            <p className="opacity-90 leading-relaxed mb-6">
              Air quality is {status.label.toLowerCase()} today. 
              {status.label === 'Good' 
                ? " Great day for outdoor activities! Enjoy the fresh air." 
                : " Consider wearing a mask if you have respiratory issues."}
            </p>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
              Read Full Guide
            </button>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
