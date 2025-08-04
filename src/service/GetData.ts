export const GetData = async (token: string, url: string, signal?: AbortSignal) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`,
      },
      signal: signal // Используем встроенную поддержку AbortController в fetch
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Запрос отменен:', error.message);
      throw new Error('Запрос был отменен');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Неизвестная ошибка');
  }
};

