const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
require('dotenv').config();
const dbHandler = require('./db-handler');
const Performer = require('../models/Performer');
const PerformanceHistory = require('../models/PerformanceHistory');

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Performers', () => {
  it('Initializes with three random, unique traits', async () => {
    let performer = new Performer({});
    let savedPerformer = await performer.save();
    expect(savedPerformer.traits.length).toEqual(3);
  });

  describe('Performers names', () => {
    it('Initializes with a randomly generated name', async () => {
      for (let i = 0; i < 100; i++) {
        let performer = new Performer({});
        let performer2 = new Performer({});
        let savedPerformer = await performer.save();
        let savedPerformer2 = await performer2.save();

        expect(savedPerformer.name).not.toEqual(savedPerformer2.name);
      }
    });
  });
  describe('perform()', () => {
    it('Adds a performance to the performance history', async () => {
      let performer = new Performer({});
      let savedPerformer = await performer.save();
      await savedPerformer.perform();
      await savedPerformer.perform();
      await savedPerformer.perform();
      let allPerformances = await PerformanceHistory.find({});
      expect(allPerformances.length).toBeGreaterThan(0);
    });

    it('Gives a net performance amount that takes costs into consideration', async () => {
      let performanceEarningsFunction = Performer.calculateEarning;
      Performer.calculateEarning = function () {
        return 100;
      };

      let performer = new Performer({});
      let savedPerformer = await performer.save();
      await savedPerformer.perform();
      let performancehistory = await PerformanceHistory.find({});
      expect(performancehistory[0].netearned).toEqual(0);

      Performer.calculateEarning = performanceEarningsFunction;
    });

    it('Affects the new worth of the performer', async () => {
      let performanceEarningsFunction = Performer.calculateEarning;
      Performer.calculateEarning = function () {
        return 200;
      };

      let performer = new Performer({});
      let savedPerformer = await performer.save();
      await savedPerformer.perform();
      let updatedPerformer = await Performer.findById(savedPerformer.id);
      expect(updatedPerformer.worth).toEqual(2100);

      Performer.calculateEarning = performanceEarningsFunction;
    });
  });

  describe('GET /', () => {
    it('has a route to get list of all performers', async () => {
      let profileQuery = await request.get('/api/performers');
      expect(profileQuery.status).toEqual(200);
    });

    it('Returns an error if there is a database failure', async () => {
      let oldPerformer = Performer.find;
      let oldConsole = console.error;
      console.error = jest.fn();
      Performer.find = jest.fn(() => {
        throw new Error('Foo');
      });
      let profileQuery = await request.get('/api/performers');
      expect(profileQuery.status).toEqual(500);

      Performer.find = oldPerformer;
      console.error = oldConsole;
    });
  });

  describe('Timeouts', () => {
    it('if a performer is on a timeout, they earn nothing for each performance', async () => {
      let performer = await new Performer({ timeout: 2 });
      let savedPerformer = await performer.save();

      await savedPerformer.perform();
      await savedPerformer.perform();

      expect(savedPerformer.worth).toEqual(1800);
    });

    it('if a performer then leaves timeout they earn money again', async () => {
      let performer = await new Performer({ timeout: 2 });
      let savedPerformer = await performer.save();

      await savedPerformer.perform();
      await savedPerformer.perform();
      await savedPerformer.perform();

      expect(savedPerformer.worth).not.toEqual(1800);
    });
  });

  describe('GET /:id', () => {
    it('Returns a performer object when searched for by id', async () => {
      let performer = await new Performer({});
      let savedPerformer = await performer.save();
      let profileQuery = await request.get(
        `/api/performers/${savedPerformer.id}`
      );
      expect(profileQuery.status).toEqual(200);
      expect(profileQuery.body._id).toEqual(savedPerformer.id);
    });

    it('Returns an error if there is a database failure', async () => {
      let oldPerformer = Performer.find;
      let oldConsole = console.error;
      console.error = jest.fn();
      Performer.find = jest.fn(() => {
        throw new Error('Foo');
      });
      let profileQuery = await request.get('/api/performers/53265426');
      expect(profileQuery.status).toEqual(500);

      Performer.find = oldPerformer;
      console.error = oldConsole;
    });
  });

  describe('#statics.allPerform', () => {
    it('makes all performers perform', async () => {
      let performer1 = await new Performer({});
      let savedPerformer1 = await performer1.save();

      let performer2 = await new Performer({});
      let savedPerformer2 = await performer2.save();

      let performer3 = await new Performer({});
      let savedPerformer3 = await performer3.save();

      await Performer.allPerform();
      await Performer.allPerform();

      let performanceHistory = await PerformanceHistory.find({});
      expect(performanceHistory.length).toBeGreaterThan(1);
    });
  });

  describe('GET /top', () => {
    it('Returns a performer list sorted by worth', async () => {
      let performer1 = await new Performer({ worth: 1000 });
      let savedPerformer1 = await performer1.save();

      let performer2 = await new Performer({ worth: 4000 });
      let savedPerformer2 = await performer2.save();

      let performer3 = await new Performer({ worth: 3000 });
      let savedPerformer3 = await performer3.save();

      let performer4 = await new Performer({ worth: 2500 });
      let savedPerformer4 = await performer4.save();

      let performer5 = await new Performer({ worth: 3500 });
      let savedPerformer5 = await performer5.save();

      let profileQuery = await request.get('/api/performers/top');
      expect(profileQuery.status).toEqual(200);
      expect(profileQuery.body[0]._id).toBe(savedPerformer2.id);
    });

    it('Returns an error if there is a database failure', async () => {
      let oldPerformer = Performer.find;
      let oldConsole = console.error;
      console.error = jest.fn();
      Performer.find = jest.fn(() => {
        throw new Error('Foo');
      });
      let profileQuery = await request.get('/api/performers/top');
      expect(profileQuery.status).toEqual(500);

      Performer.find = oldPerformer;
      console.error = oldConsole;
    });
  });
});
