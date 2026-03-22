import { motion } from "framer-motion";
import { Activity, CheckCircle2, Clock3, Flame } from "lucide-react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AnimatedCounter({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.4, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {value}
    </motion.span>
  );
}

function AnalyticsPanel({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
  ).length;

  const chartData = {
    doughnut: {
      labels: ["Completed", "Pending"],
      datasets: [
        {
          data: [completedTasks, pendingTasks],
          backgroundColor: ["#16a34a", "#155eef"],
          borderWidth: 0,
        },
      ],
    },
    bar: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Tasks Created",
          data: Array.from({ length: 7 }, (_, index) =>
            tasks.filter((task) => new Date(task.createdAt).getDay() === index).length
          ),
          backgroundColor: "#38bdf8",
          borderRadius: 10,
        },
      ],
    },
  };

  const metricCards = [
    { label: "Total Tasks", value: totalTasks, icon: Activity },
    { label: "Completion", value: `${completionRate}%`, icon: CheckCircle2 },
    { label: "Pending", value: pendingTasks, icon: Clock3 },
    { label: "Overdue", value: overdueTasks, icon: Flame },
  ];

  return (
    <section className="analytics-panel">
      <div className="task-panel-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>Performance snapshot</h2>
        </div>
      </div>

      <div className="analytics-grid">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              className="metric-card hoverable-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <div className="metric-card-top">
                <span>{card.label}</span>
                <Icon size={18} />
              </div>
              <strong>
                <AnimatedCounter value={card.value} />
              </strong>
            </motion.div>
          );
        })}
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-copy">
            <h3>Completion ratio</h3>
            <p>Completed versus still in motion.</p>
          </div>
          <div className="chart-canvas doughnut-wrap">
            <Doughnut
              data={chartData.doughnut}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
                cutout: "68%",
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-copy">
            <h3>Weekly task flow</h3>
            <p>How task creation is spreading across the week.</p>
          </div>
          <div className="chart-canvas">
            <Bar
              data={chartData.bar}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsPanel;
