export default async function handler(req, res) {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return res.status(500).json({ error: "Missing Redis credentials" });
    }

    // 오늘 날짜 (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    const key = `visits:${today}`;

    // Redis INCR 명령어 (카운트 1 증가)
    const response = await fetch(`${url}/incr/${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const count = data.result || 0;

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
