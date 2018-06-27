/* global browser, exampleCanRenderTest, itownsPort */
const assert = require('assert');

describe('planar', () => {
    it('should run', async function _() {
        const page = await browser.newPage();

        await page.setViewport({ width: 400, height: 300 });
        await page.goto(`http://localhost:${itownsPort}/examples/planar.html`);
        await page.waitFor('#viewerDiv > canvas');

        const result = await exampleCanRenderTest(page, this.test.fullTitle());

        assert.ok(result);
        await page.close();
    });
    it('should get picking position from depth', async function _() {
        const page = await browser.newPage();

        await page.setViewport({ width: 400, height: 300 });
        await page.goto(`http://localhost:${itownsPort}/examples/planar_vector.html`);
        await page.waitFor('#viewerDiv > canvas');
        await exampleCanRenderTest(page, this.test.fullTitle());

        const length = 1500;

        // get range with depth buffer and altitude
        const result = await page.evaluate((l) => {
            const lookat = extent.center().xyz();

            view.camera.camera3D.position.copy(lookat);
            view.camera.camera3D.position.z = l;
            view.camera.camera3D.lookAt(lookat);
            view.notifyChange(view.camera.camera3D, true);
            const depthMethod = view
                .getPickingPositionFromDepth().distanceTo(view.camera.camera3D.position);

            const altitude = itowns.DEMUtils
                .getElevationValueAt(view.tileLayer, extent.center().clone()).z;

            return { depthMethod, altitude };
        }, length);
        // threoric range between ground and camera
        const theoricRange = length - result.altitude;
        const diffRange = Math.abs(theoricRange - result.depthMethod);
        assert.ok(diffRange < 1);
        await page.close();
    });
});
