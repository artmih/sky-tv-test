/* global describe, it, before, after */
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

let skyServer = require('../app/server');
let server;

describe('/service/location Location service', () => {

    before((done) => {
        let skyServerApp = skyServer();
        server = skyServerApp.listen(3000);
        done();
    });

    after((done) => {
        server.close();
        done();
    });
    
    it('POST /service/location customer is invalid error', (done) => {
        chai.request(server)
            .post('/service/location')
            .send({ 'customerID': '' })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql('CustomerID is invalid!');
                done();
            });
    });

    it('POST /service/location customer london location', (done) => {
        chai.request(server)
            .post('/service/location')
            .send({ 'customerID': 'customerID_londonUser' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('locationID');
                res.body.locationID.should.be.eql('LONDON');
                done();
            });
    });

    it('POST /service/location customer liverpool location', (done) => {
        chai.request(server)
            .post('/service/location')
            .send({ 'customerID': 'customerID_liverpoolUser' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('locationID');
                res.body.locationID.should.be.eql('LIVERPOOL');
                done();
            });
    });

    it('POST /service/location customer not found error', (done) => {
        chai.request(server)
            .post('/service/location')
            .send({ 'customerID': 'test' })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql('CustomerID not found!');
                done();
            });
    });

});

describe('/service/catalogue Catalogue service', () => {

    before((done) => {
        let skyServerApp = skyServer();
        server = skyServerApp.listen(3000);
        done();
    });

    after((done) => {
        server.close();
        done();
    });
    
    it('POST /service/catalogue location is invalid error', (done) => {
        chai.request(server)
            .post('/service/catalogue')
            .send({ 'locationID': '' })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql('LocationID is invalid!');
                done();
            });
    });

    it('POST /service/catalogue london location catalog', (done) => {
        chai.request(server)
            .post('/service/catalogue')
            .send({ 'locationID': 'LONDON' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(4);
                res.body.should.be.eql([
                    { category: 'Sports', product: 'Arsenal TV', locationID: 'LONDON' },
                    { category: 'Sports', product: 'Chelsea TV', locationID: 'LONDON' },
                    { category: 'News', product: 'Sky News', locationID: '' },
                    { category: 'News', product: 'Sky Sports News', locationID: '' }
                ]);
                done();
            });
    });

    it('POST /service/catalogue liverpool location catalog', (done) => {
        chai.request(server)
            .post('/service/catalogue')
            .send({ 'locationID': 'LIVERPOOL' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(3);
                res.body.should.be.eql([
                    { category: 'Sports', product: 'Liverpool TV', locationID: 'LIVERPOOL' },
                    { category: 'News', product: 'Sky News', locationID: '' },
                    { category: 'News', product: 'Sky Sports News', locationID: '' }
                ]);
                done();
            });
    });
});