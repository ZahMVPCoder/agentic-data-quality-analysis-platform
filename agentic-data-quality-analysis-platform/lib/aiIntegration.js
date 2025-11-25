export async function getAIInsights(analysis) {
  if (!analysis || !analysis.summary || !analysis.columns) {
    console.error("Invalid analysis object:", analysis);
    return { error: "Analysis object is missing required fields" };
  }

  try {
    const res = await fetch("/api/ai-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analysis),
    });

    if (!res.ok) {
      throw new Error("Server failed to generate insights");
    }

    return await res.json();
  } catch (err) {
    console.error("Frontend AI error:", err);
    return { error: "Unable to generate AI insights" };
  }
}