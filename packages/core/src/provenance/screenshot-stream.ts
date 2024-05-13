/**
 * Factory function to create an instance of ScreenshotStream.
 * Captures and stores a sequence of screenshots of the current tab.
 * First, opens a MediaStream of the current tab, then can capture screenshots.
 * A screenshot can also be captured on-demand via capture() or after a delay via delayCapture().
 * Requires browser permissions to capture screen.
 * Must be activated via start() and deactivated via stop(); failure to stop
 * will result in a memory leak.
 * All functions are bound to the class, so they can be passed as callbacks.
 */
export function intitializeScreenshotStream(
    newScreenshotCallbacks?: ((frame: ImageData) => void)[]
) {
    /// Fields
    /**
     * Video element for capturing screenshots. Null if not started or stopped.
     */
    let video: HTMLVideoElement | null = null;

    /**
     * Array of captured screenshots.
     */
    const screenshots: ImageData[] = [];

    /**
     * ID of the timeout for delayCapture.
     * Null if no timeout is active.
     */
    let currentTimeout: NodeJS.Timeout | null = null;

    /**
     * Optional callbacks to run after each screenshot is captured.
     */
    const newScreenshotCallback: ((frame: ImageData) => void)[] | null =
        newScreenshotCallbacks ?? null;

    /// Constructor
    if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error('MediaDevices API or getDisplayMedia() not available');
    }

    /// Methods
    /**
     * Starts the media stream needed to capture screenshots on-demand.
     * Will prompt the user for permission to capture the screen.
     * @throws Error if unable to start the recording; usually due to the user denying permission.
     * @param callback Optional callback to run after the stream is started.
     */
    async function start(callback?: () => void): Promise<void> {
        video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.pointerEvents = 'none';
        video.style.visibility = 'hidden';
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';

        try {
            await navigator.mediaDevices
                // Need to cast because TS doesn't know about preferCurrentTab
                .getDisplayMedia({
                    preferCurrentTab: true,
                } as DisplayMediaStreamOptions)
                .then((stream) => {
                    // TS is not confident that video is not null (but I am), so we need to check
                    video ? (video.srcObject = stream) : null;
                });
        } catch (e) {
            video = null;
            throw new Error(`Unable to start recording: ${e}`);
        }

        if (video.srcObject) {
            // Needs to be in the DOM to capture screenshots
            document.body.appendChild(video);
            callback ? callback() : null;
        } else {
            // I honestly don't know how we'd get here
            throw new Error('Unable to start recording; no stream available');
        }
    }

    /**
     * Pushes a screenshot frame to the screenshots array
     * and invokes the newScreenshotCallbacks if available.
     * @param frame - The screenshot frame to be pushed.
     */
    function push(frame: ImageData): void {
        screenshots.push(frame);
        for (const callback of newScreenshotCallback ?? []) {
            callback(frame);
        }
    }

    /**
     * Captures a screenshot and stores it in the screenshots array.
     * Also pushes the screenshot to the newScreenshotCallback if available.
     * @throws Error if recording has not been started.
     * @throws Error if unable to get 2D rendering context.
     * @returns The captured screenshot.
     */
    function capture(): ImageData {
        if (!video) {
            throw new Error('Recording not started');
        }

        const videoSettings = (video.srcObject as MediaStream)
            ?.getVideoTracks()[0]
            .getSettings();
        const canvas = document.createElement('canvas');
        canvas.width = videoSettings.width || 0;
        canvas.height = videoSettings.height || 0;

        const context = canvas.getContext('2d');
        if (!context) {
            // GetContext can return undefined and null (probably due to lack of browser support)
            throw new Error('Unable to get 2D rendering context');
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frame = context.getImageData(0, 0, canvas.width, canvas.height);
        push(frame);

        canvas.remove();
        return frame;
    }

    /**
     * Captures a screenshot after a timeout delay.
     * If one timeout is already active, a screenshot is taken immediately
     * and the old timeout is cleared and replaced with the new delay.
     * @param timeout The delay in milliseconds before capturing the screenshot.
     */
    function delayCapture(timeout: number): void {
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
            capture();
        }
        currentTimeout = setTimeout(() => {
            capture();
            currentTimeout = null;
        }, timeout);
    }

    /**
     * Stops the media stream and removes the video element from the DOM.
     * Must be called to prevent memory leaks.
     */
    function stop(): void {
        if (video) {
            video.srcObject = null;
            video.remove();
            video = null;
        }
    }

    /**
     * Returns the nth most recent screenshot in the array of stored screenshots.
     * @param n - The index of the screenshot to retrieve.
     * 1 is the most recent screenshot, 0 is the least recent.
     * @returns The nth screenshot.
     */
    function getNth(n: number): ImageData {
        if (n < 0 || n >= screenshots.length) {
            throw new Error(`Screenshot index out of bounds: ${n}`);
        }
        return screenshots[screenshots.length - 1 - n];
    }

    /**
     * Returns the number of stored screenshots.
     * @returns The number of stored screenshots.
     */
    function count(): number {
        return screenshots.length;
    }

    /**
     * Returns a copy of the array of stored screenshots.
     * @returns The stored screenshots.
     */
    function getAll(): ImageData[] {
        return [...screenshots];
    }

    return {
        start,
        capture,
        delayCapture,
        stop,
        getNth,
        count,
        getAll,
    };
}

/**
 * Downloads a screenshot as a PNG file.
 * @param frame - The screenshot frame to download.
 * @param name - The name of the file to download.
 */
export function downloadScreenshot(frame: ImageData, name: string): void {
    const canvas = document.createElement('canvas');
    canvas.width = frame.width;
    canvas.height = frame.height;

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Unable to get 2D rendering context');
    }
    context.putImageData(frame, 0, 0);

    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = name;
    a.click();

    canvas.remove();
    a.remove();
}
