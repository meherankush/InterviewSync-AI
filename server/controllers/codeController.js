const languageIds = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
};

export const runCode = async (req, res) => {
    try {
        const { code, language, stdin = '' } = req.body;
        const languageId = languageIds[language];

        if (!code || typeof code !== 'string') {
            return res.status(400).json({ error: 'Source code is required.' });
        }

        if (!languageId) {
            return res.status(400).json({ error: 'Unsupported language selected.' });
        }

        const judge0Url = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
        const headers = {
            'Content-Type': 'application/json',
        };

        if (process.env.JUDGE0_API_KEY) {
            headers['X-Auth-Token'] = process.env.JUDGE0_API_KEY;
        }

        const response = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                source_code: code,
                language_id: languageId,
                stdin,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: result?.error || result?.message || 'Code execution failed.',
            });
        }

        res.json({
            stdout: result.stdout || '',
            stderr: result.stderr || '',
            compileOutput: result.compile_output || '',
            message: result.message || '',
            status: result.status?.description || 'Unknown',
            time: result.time || null,
            memory: result.memory || null,
        });
    } catch (error) {
        console.error('Code execution error:', error);
        res.status(500).json({ error: error.message });
    }
};
