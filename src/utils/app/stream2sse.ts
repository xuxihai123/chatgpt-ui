import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

// 把openai stream => event source stream;
export const StreamToEventSource = (res: Response) => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
        async start(controller) {
            const onParse = (event: ParsedEvent | ReconnectInterval) => {
                if (event.type === 'event') {
                    const data = event.data;

                    if (data === '[DONE]') {
                        controller.close();
                        return;
                    }

                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta.content;
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                    } catch (e) {
                        controller.error(e);
                    }
                }
            };

            const parser = createParser(onParse);
            const reader = res.body?.getReader();

            while (true) {
                const data = await reader?.read();
                const { done, value } = data as any;
                if (done) {
                    break;
                } else {
                    parser.feed(decoder.decode(value));
                }
            }
        }
    });

    return stream;
};
