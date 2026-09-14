// Grab the URL from your environment, or fallback to localhost for testing
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const submitExecution = async (githubId, nodeId, submissionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/execution/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        github_id: githubId,
        node_id: nodeId,
        submission_data: submissionData,
      }),
    });

    if (!response.ok) {
      throw new Error(`VC Engine Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to submit execution:", error);
    throw error;
  }
};