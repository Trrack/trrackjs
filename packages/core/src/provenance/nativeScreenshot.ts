import { takeScreenshot, checkIfBrowserSupported } from '@xata.io/screenshot';
import { downloadBase64File } from './screenshot';

export function downloadNativeScreenshot(filename: string) {
    if (!checkIfBrowserSupported()) {
        console.log(
            'Warning: This browser does not support taking screenshots.'
        );
        return;
    }

    takeScreenshot().then((data) => {
        console.log(data);
        downloadBase64File(
            'image/png',
            data.replace('data:image/jpeg;base64,', ''),
            filename
        );
    });
}
