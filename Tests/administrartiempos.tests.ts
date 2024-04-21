import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';

describe('Administrador de Tiempos', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  }, 10000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('debería agregar una nueva entrada al enviar el formulario', async () => {
    try {
      await driver.get('http://localhost:3000/Admin/administrarTiempos');

      // Llenar los campos del formulario
      const nombreCarreraInput = await driver.wait(until.elementLocated(By.id('nombreCarrera')), 20000);
      await nombreCarreraInput.sendKeys('Nombre de la Carrera de Prueba');

      const nombreAtletaInput = await driver.wait(until.elementLocated(By.id('nombreAtleta')), 20000);
      await nombreAtletaInput.sendKeys('John Doe');

     
      const agregarButton = await driver.wait(until.elementLocated(By.xpath('//button[text()="Agregar"]')), 20000);
      await agregarButton.click();

      await driver.wait(until.elementLocated(By.xpath(`//td[text()='Nombre de la Carrera de Prueba']`)), 20000);
      await driver.wait(until.elementLocated(By.xpath(`//td[text()='John Doe']`)), 20000);


    } catch (error) {
      console.error('Error durante la ejecución de la prueba:', error);
    }
  }, 60000);
});
