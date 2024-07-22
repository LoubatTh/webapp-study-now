import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect } from "react";

const chartConfig = {
  result: {
    label: "result",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type StatGraphProps = {
  results: any[];
  maxScore?: number;
};

const StatGraph = ({ results, maxScore }: StatGraphProps) => {
  useEffect(() => {
    // Store original methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Override methods to suppress specific warnings
    console.warn = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Support for defaultProps")
      ) {
        return;
      }
      originalWarn(...args);
    };

    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Support for defaultProps")
      ) {
        return;
      }
      originalError(...args);
    };

    // Restore original methods on cleanup
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  const getTicks = (maxScore) => {
    return [0, maxScore * 0.25, maxScore * 0.5, maxScore * 0.75, maxScore];
  };
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[80px] max-h-[200px] w-full pr-8"
    >
      <BarChart
        accessibilityLayer
        data={results}
        margin={{
          top: 35,
        }}
        maxBarSize={35}
      >
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={5}
          axisLine={true}
          tickFormatter={(value) => value.slice(0, 5)}
        />
        {maxScore ? (
          <>
            <YAxis domain={[0, maxScore]} ticks={getTicks(maxScore)} />
            <ReferenceLine y={maxScore} stroke="gray" />
            <ReferenceLine y={maxScore / 2} stroke="gray" />
          </>
        ) : (
          <>
            <YAxis domain={[1, 5]} />
            <ReferenceLine y={5} stroke="gray" />
            <ReferenceLine y={3} stroke="gray" />
          </>
        )}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="result"
          fill="var(--color-result)"
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default StatGraph;
