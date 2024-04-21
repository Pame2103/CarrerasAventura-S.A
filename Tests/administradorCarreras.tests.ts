import { Builder, By, until, WebDriver } from 'selenium-webdriver';

describe('Administrador de Carreras', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('debería agregar una nueva carrera al enviar el formulario', async () => {
    try {
      await driver.get('http://localhost:3000/Admin/administradorCarreras');

      // Rellenar el formulario
      const nombreInput = await driver.wait(until.elementLocated(By.id('nombre')), 20000);
      await nombreInput.sendKeys('Carrera de Prueba');

      const edicionInput = await driver.wait(until.elementLocated(By.id('edicion')), 20000);
      await edicionInput.sendKeys('3 TH');

      const fechaInput = await driver.wait(until.elementLocated(By.id('fecha')), 20000);
      await fechaInput.sendKeys('2024-04-20');

      const responsableInput = await driver.wait(until.elementLocated(By.id('responsable')), 20000);
      await responsableInput.sendKeys('Juan Mora');

      const contactoInput = await driver.wait(until.elementLocated(By.id('contacto')), 20000);
      await contactoInput.sendKeys('carreraschirripo@gmail.com');

      const lugarInput = await driver.wait(until.elementLocated(By.id('lugar')), 20000);
      await lugarInput.sendKeys('Cerro chirripo, Perez Zeledon, San Jose, Costa Rica');

      const distanciaInput = await driver.wait(until.elementLocated(By.id('distancia')), 20000);
      await distanciaInput.sendKeys('11 KM');

      const limiteParticipanteInput = await driver.wait(until.elementLocated(By.id('limiteParticipante')), 20000);
      await limiteParticipanteInput.sendKeys('50');

      const cupoDisponibleInput = await driver.wait(until.elementLocated(By.id('cupoDisponible')), 20000);
      await cupoDisponibleInput.sendKeys('50');

      const costoInput = await driver.wait(until.elementLocated(By.id('costo')), 20000);
      await costoInput.sendKeys('$12000');

      const horaInput = await driver.wait(until.elementLocated(By.id('hora')), 20000);
      await horaInput.sendKeys('8:00 am');


      const agregarButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Agregar Carrera"]')), 20000);
      await agregarButton.click();

      await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), 'La carrera se agregó con éxito.')]`)), 20000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toEqual('http://localhost:3000/Cliente/carreras');

      // Verificar que la carrera agregada se muestre en la página de carreras de clientes
      const nuevaCarrera = await driver.findElement(By.xpath(`//div[contains(text(), 'Carrera de Prueba')]`));
      expect(await nuevaCarrera.isDisplayed()).toBe(true);

    } catch (error) {
      console.error('Error durante la ejecución de la prueba:', error);
    }
  }, 60000);
});
