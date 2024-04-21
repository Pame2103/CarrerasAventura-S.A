import { Builder, By, until, WebDriver } from 'selenium-webdriver';

describe('Inscripción a Carreras', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('debería enviar correctamente el formulario de inscripción', async () => {
    try {
      await driver.get('http://localhost:3000/Cliente/Inscripciones');

      // formulario
      const nombreInput = await driver.wait(until.elementLocated(By.id('nombre')), 20000);
      await nombreInput.sendKeys('Juan');

      const apellidosInput = await driver.wait(until.elementLocated(By.id('apellidos')), 20000);
      await apellidosInput.sendKeys('Pérez');

      const identificacionSelect = await driver.wait(until.elementLocated(By.id('identificacion')), 20000);
      await identificacionSelect.sendKeys('cedula');

      const cedulaInput = await driver.wait(until.elementLocated(By.id('cedula')), 20000);
      await cedulaInput.sendKeys('123456789');

      const sexoSelect = await driver.wait(until.elementLocated(By.id('sexo')), 20000);
      await sexoSelect.sendKeys('masculino');

      const nacimientoInput = await driver.wait(until.elementLocated(By.id('nacimiento')), 20000);
      await nacimientoInput.sendKeys('1990-05-15');

      const edadInput = await driver.wait(until.elementLocated(By.id('edad')), 20000);
      await edadInput.sendKeys('33');

      const emailInput = await driver.wait(until.elementLocated(By.id('email')), 20000);
      await emailInput.sendKeys('juan@gmail.com');

      const paisSelect = await driver.wait(until.elementLocated(By.id('pais')), 20000);
      await paisSelect.sendKeys('Costa Rica');

      const codigoPaisSelect = await driver.wait(until.elementLocated(By.xpath('//select[@id="pais"]')), 20000);
      await codigoPaisSelect.sendKeys('+506');

      const telefonoInput = await driver.wait(until.elementLocated(By.id('telefono')), 20000);
      await telefonoInput.sendKeys('12345678');

      const tallaCamisaSelect = await driver.wait(until.elementLocated(By.id('tallaCamisa')), 20000);
      await tallaCamisaSelect.sendKeys('M-AD-M');

      const lateralidadSelect = await driver.wait(until.elementLocated(By.id('lateralidad')), 20000);
      await lateralidadSelect.sendKeys('derecha');

      const discapacidadSelect = await driver.wait(until.elementLocated(By.id('discapacidad')), 20000);
      await discapacidadSelect.sendKeys('No aplica');

      const alergiaMedicamentoSelect = await driver.wait(until.elementLocated(By.id('alergiaMedicamento')), 20000);
      await alergiaMedicamentoSelect.sendKeys('No aplica');

      const nombreEmergenciaInput = await driver.wait(until.elementLocated(By.id('nombreEmergencia')), 20000);
      await nombreEmergenciaInput.sendKeys('María Pérez');

      const identificacionEmergenciaSelect = await driver.wait(until.elementLocated(By.id('identificacionEmergencia')), 20000);
      await identificacionEmergenciaSelect.sendKeys('cedula');

      const identificacionCedulaInput = await driver.wait(until.elementLocated(By.id('identificacionCedula')), 20000);
      await identificacionCedulaInput.sendKeys('987654321');

      const codigoPaisEmergenciaSelect = await driver.wait(until.elementLocated(By.id('codigoPaisEmergencia')), 20000);
      await codigoPaisEmergenciaSelect.sendKeys('+506');

      const telefonoEmergenciaInput = await driver.wait(until.elementLocated(By.id('telefonoEmergencia')), 20000);
      await telefonoEmergenciaInput.sendKeys('87654321');

      const parentescoEmergenciaSelect = await driver.wait(until.elementLocated(By.id('parentescoEmergencia')), 20000);
      await parentescoEmergenciaSelect.sendKeys('madre');

      const eventoSelect = await driver.wait(until.elementLocated(By.id('evento')), 20000);
      await eventoSelect.sendKeys('Carrera de Prueba');

      const metodoPagoSelect = await driver.wait(until.elementLocated(By.id('metodoPago')), 20000);
      await metodoPagoSelect.sendKeys('sinpe');

      const codigoComprobanteInput = await driver.wait(until.elementLocated(By.id('codigoComprobante')), 20000);
      await codigoComprobanteInput.sendKeys('123456789');

      const aceptarTerminosCheckbox = await driver.wait(until.elementLocated(By.id('aceptarTerminos')), 20000);
      await aceptarTerminosCheckbox.click();

      const enviarButton = await driver.wait(until.elementLocated(By.xpath('//input[@type="submit"]')), 20000);
      await enviarButton.click();

      await driver.wait(until.elementLocated(By.xpath('//div[contains(text(), "Inscripción enviada correctamente")]')), 20000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toEqual('http://localhost:3000/Admin/confirmaciones');
    } catch (error) {
      console.error('Error durante la ejecución de la prueba:', error);
    }
  }, 90000);
});