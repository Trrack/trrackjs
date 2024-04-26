import html2canvas from 'html2canvas';

/**
 * Download a base64 file
 * @param contentType content type of the file
 * @param base64Data contents of the file in base64 format
 * @param fileName name of the file
 */
export function downloadBase64File(
    contentType: string,
    base64Data: string,
    fileName: string
): void {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

/**
 * Converts an element to a base64 image and calls the callback with the base64 image data, which encodes a png
 * @param element Element to convert to base64 image
 * @param posX x-coordinate of the top-left corner of the image, relative to the element.
 *             0 captures the left of the element
 * @param posY y-coordinate of the top-left corner of the image, relative to the element.
 *             0 captures the top of the element
 * @param width width of the image to capture. Will crop element if smaller than element width
 * @param height height of the image to capture. Will crop element if smaller than element height
 * @param callback success callback, which the base64 image is passed to
 */
export function getScreenshotOfElement(
    element: HTMLElement,
    posX: number,
    posY: number,
    width: number,
    height: number,
    callback: (data: string) => void
): void {
    html2canvas(element, {
        width: width,
        height: height,
        useCORS: true,
        allowTaint: false,
    }).then((canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d');
        const imageData = context?.getImageData(posX, posY, width, height).data;
        const outputCanvas = document.createElement('canvas');
        const outputContext = outputCanvas.getContext('2d');
        outputCanvas.width = width;
        outputCanvas.height = height;

        const idata = outputContext?.createImageData(width, height);
        if (imageData && idata) {
            idata?.data.set(imageData);
            outputContext?.putImageData(idata, 0, 0);
            callback(
                outputCanvas.toDataURL().replace('data:image/png;base64,', '')
            );
        }
    });
}

/**
 * Screenshots an element as a png and prompts the user to download the image
 * @param element Element to take a screenshot of
 * @param fileName Name of the file to download
 */
export function downloadScreenshotOfElement(
    element: HTMLElement,
    fileName: string
): void {
    const { width, height } = element.getBoundingClientRect();
    getScreenshotOfElement(element, 0, 0, width, height, (data: string) => {
        downloadBase64File('image/png', data, fileName);
    });
}
