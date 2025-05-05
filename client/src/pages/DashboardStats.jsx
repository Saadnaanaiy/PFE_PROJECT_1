import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

export default function DashboardStats({ dashboardData }) {
  const [coursesByLevel, setCoursesByLevel] = useState([]);
  const [coursesByPrice, setCoursesByPrice] = useState([]);
  const [coursesByDuration, setCoursesByDuration] = useState([]);
  const [userCounts, setUserCounts] = useState({ students: 0, instructors: 0 });

  // Refs for chart canvases
  const coursesChartRef = useRef(null);
  const priceChartRef = useRef(null);
  const durationChartRef = useRef(null);
  const growthChartRef = useRef(null);

  // Refs to store chart instances
  const coursesChartInstance = useRef(null);
  const priceChartInstance = useRef(null);
  const durationChartInstance = useRef(null);
  const growthChartInstance = useRef(null);

  // Colors for charts
  const COLORS = [
    'rgba(14, 165, 233, 0.8)', // blue
    'rgba(139, 92, 246, 0.8)', // purple
    'rgba(16, 185, 129, 0.8)', // green
    'rgba(245, 158, 11, 0.8)', // amber
    'rgba(239, 68, 68, 0.8)', // red
    'rgba(236, 72, 153, 0.8)', // pink
  ];

  useEffect(() => {
    // Process courses by level
    if (dashboardData?.courses?.length) {
      const levelCounts = {};
      dashboardData.courses.forEach((course) => {
        const niveau = course.categorie?.niveau || course.niveau || 'Unknown';
        levelCounts[niveau] = (levelCounts[niveau] || 0) + 1;
      });
      const levelData = Object.keys(levelCounts).map((level) => ({
        name: level,
        count: levelCounts[level],
      }));
      setCoursesByLevel(levelData);
    }

    // Process courses by price
    if (dashboardData?.courses?.length) {
      const priceRanges = [
        { name: '0-50 MAD', min: 0, max: 50 },
        { name: '51-100 MAD', min: 50.01, max: 100 },
        { name: '101-150 MAD', min: 100.01, max: 150 },
        { name: '151-200 MAD', min: 150.01, max: 200 },
        { name: '201+ MAD', min: 200.01, max: Infinity },
      ];

      dashboardData.courses.forEach((course) => {
        const price = parseFloat(course.prix) || 0;
        priceRanges.forEach((range) => {
          if (price >= range.min && price <= range.max) range.count++;
        });
      });
      setCoursesByPrice(priceRanges.filter((r) => r.count > 0));
    }

    // Process courses by duration
    if (dashboardData?.courses?.length) {
      const durationRanges = [
        { name: '< 1 hour', min: 0, max: 59, count: 0 },
        { name: '1-2 hours', min: 60, max: 119, count: 0 },
        { name: '2-4 hours', min: 120, max: 239, count: 0 },
        { name: '4-8 hours', min: 240, max: 479, count: 0 },
        { name: '8+ hours', min: 480, max: Infinity, count: 0 },
      ];
      dashboardData.courses.forEach((course) => {
        const duration = course.dureeMinutes || 0;
        durationRanges.forEach((range) => {
          if (duration >= range.min && duration <= range.max) range.count++;
        });
      });
      setCoursesByDuration(durationRanges.filter((r) => r.count > 0));
    }

    // Set user counts
    const totalStudents = dashboardData?.etudiants?.length || 0;
    const totalInstructors = dashboardData?.instructeurs?.length || 0;
    setUserCounts({ students: totalStudents, instructors: totalInstructors });
  }, [dashboardData]);

  useEffect(() => {
    // User counts chart
    if (growthChartRef.current) {
      if (growthChartInstance.current) growthChartInstance.current.destroy();
      const ctx = growthChartRef.current.getContext('2d');
      growthChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Etudiants', 'Instructeurs'],
          datasets: [
            {
              label: 'Count',
              data: [userCounts.students, userCounts.instructors],
              backgroundColor: [COLORS[0], COLORS[1]],
              borderColor: ['white', 'white'],
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.raw} users` } },
          },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
            x: { grid: { display: false } },
          },
        },
      });
    }

    // Courses by level chart
    if (coursesChartRef.current && coursesByLevel.length) {
      if (coursesChartInstance.current) coursesChartInstance.current.destroy();
      const ctx = coursesChartRef.current.getContext('2d');
      coursesChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: coursesByLevel.map((i) => i.name),
          datasets: [
            {
              label: 'Courses',
              data: coursesByLevel.map((i) => i.count),
              backgroundColor: coursesByLevel.map(
                (_, i) => COLORS[i % COLORS.length],
              ),
              borderColor: 'rgba(255,255,255,0.8)',
              borderWidth: 1,
              borderRadius: 4,
              barThickness: 20,
              maxBarThickness: 30,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, ticks: { precision: 0 } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    // Courses by price chart
    if (priceChartRef.current) {
      if (priceChartInstance.current) priceChartInstance.current.destroy();
      const ctx = priceChartRef.current.getContext('2d');
      priceChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: coursesByPrice.map((i) => i.name),
          datasets: [
            {
              label: 'Number of Courses',
              data: coursesByPrice.map((i) => i.count),
              backgroundColor: coursesByPrice.map(
                (_, i) => COLORS[i % COLORS.length],
              ),
              borderColor: 'white',
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } },
            x: { grid: { display: false } },
          },
        },
      });
    }

    // Courses by duration chart
    if (durationChartRef.current && coursesByDuration.length) {
      if (durationChartInstance.current)
        durationChartInstance.current.destroy();
      const ctx = durationChartRef.current.getContext('2d');
      durationChartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: coursesByDuration.map((i) => i.name),
          datasets: [
            {
              label: 'Courses',
              data: coursesByDuration.map((i) => i.count),
              backgroundColor: coursesByDuration.map(
                (_, i) => COLORS[i % COLORS.length],
              ),
              borderColor: 'white',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12, padding: 15, font: { size: 11 } },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const val = ctx.raw;
                  const total = ctx.dataset.data.reduce((s, v) => s + v, 0);
                  const pct = Math.round((val / total) * 100);
                  return `${val} courses (${pct}%)`;
                },
              },
            },
          },
        },
      });
    }

    // Cleanup on unmount
    return () => {
      [
        growthChartInstance,
        coursesChartInstance,
        priceChartInstance,
        durationChartInstance,
      ].forEach((ref) => {
        if (ref.current) ref.current.destroy();
      });
    };
  }, [userCounts, coursesByLevel, coursesByPrice, coursesByDuration]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
      {/* User Counts */}
      <div className="bg-white p-6 rounded-xl shadow-md md:col-span-12">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">
          Utilisateurs Actuels
        </h3>
        <div className="h-72">
          <canvas ref={growthChartRef} />
        </div>
      </div>

      {/* Courses by Level */}
      <div className="bg-white p-6 rounded-xl shadow-md md:col-span-6">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">
          Courses by Level
        </h3>
        <div className="h-80">
          <canvas ref={coursesChartRef} />
        </div>
      </div>

      {/* Courses by Price */}
      <div className="bg-white p-6 rounded-xl shadow-md md:col-span-6">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">
          Course Distribution by Price
        </h3>
        <div className="h-80">
          <canvas ref={priceChartRef} />
        </div>
      </div>

      {/* Courses by Duration */}
      <div className="bg-white p-6 rounded-xl shadow-md md:col-span-12">
        <h3 className="text-lg font-medium text-neutral-800 mb-4">
          Course Distribution by Duration
        </h3>
        <div className="h-72 flex justify-center">
          <canvas ref={durationChartRef} />
        </div>
      </div>
    </div>
  );
}
