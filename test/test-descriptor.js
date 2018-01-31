var should = require('should');
var sinon = require('sinon');

var Descriptor = require('../lib/descriptor');

describe('Descriptor', function() {
  var mockNoble = null;
  var mockPeripheralId = 'mock-peripheral-id';
  var mockServiceId = 'mock-service-id';
  var mockServiceUuid = 'mock-service-uuid';
  var mockCharacteristicUuid = 'mock-characteristic-uuid';
  var mockCharacteristicId = 'mock-characteristic-id';
  var mockId = 'mock-id';
  var mockUuid = 'mock-uuid';

  var descriptor = null;

  beforeEach(function() {
    mockNoble = {
      readValue: sinon.spy(),
      writeValue: sinon.spy()
    };

    descriptor = new Descriptor(mockNoble, mockPeripheralId, mockServiceId, mockServiceUuid, mockCharacteristicId, mockCharacteristicUuid, mockId, mockUuid);
  });

  afterEach(function() {
    descriptor = null;
  });

  it('should have a uuid', function() {
    descriptor.uuid.should.equal(mockUuid);
  });

  it('should lookup name and type by uuid', function() {
    descriptor = new Descriptor(mockNoble, mockPeripheralId, mockServiceId, mockServiceUuid, mockCharacteristicId, mockCharacteristicUuid, mockId, '2900');

    descriptor.name.should.equal('Characteristic Extended Properties');
    descriptor.type.should.equal('org.bluetooth.descriptor.gatt.characteristic_extended_properties');
  });

  describe('toString', function() {
    it('should be uuid, name, type', function() {
      descriptor.toString().should.equal('{"id":"mock-id","uuid":"mock-uuid","name":null,"type":null}');
    });
  });

  describe('readValue', function() {
    it('should delegate to noble', function() {
      descriptor.readValue();

      mockNoble.readValue.calledWithExactly(mockPeripheralId, mockServiceId, mockCharacteristicId, mockId).should.equal(true);
    });

    it('should callback', function() {
      var calledback = false;

      descriptor.readValue(function() {
        calledback = true;
      });
      descriptor.emit('valueRead');

      calledback.should.equal(true);
    });

    it('should not call callback twice', function() {
      var calledback = 0;

      descriptor.readValue(function() {
        calledback += 1;
      });
      descriptor.emit('valueRead');
      descriptor.emit('valueRead');

      calledback.should.equal(1);
    });

    it('should callback with error, data', function() {
      var mockData = new Buffer(0);
      var callbackData = null;

      descriptor.readValue(function(error, data) {
        callbackData = data;
      });
      descriptor.emit('valueRead', mockData);

      callbackData.should.equal(mockData);
    });
  });

  describe('writeValue', function() {
    var mockData = null;

    beforeEach(function() {
      mockData = new Buffer(0);
    });

    it('should only accept data as a buffer', function() {
      mockData = {};

      (function(){
        descriptor.writeValue(mockData);
      }).should.throwError('data must be a Buffer');
    });

    it('should delegate to noble', function() {
      descriptor.writeValue(mockData);

      mockNoble.writeValue.calledWithExactly(mockPeripheralId, mockServiceId, mockCharacteristicId, mockId,  mockData).should.equal(true);
    });

    it('should callback', function() {
      var calledback = false;

      descriptor.writeValue(mockData, function() {
        calledback = true;
      });
      descriptor.emit('valueWrite');

      calledback.should.equal(true);
    });

    it('should not call callback twice', function() {
      var calledback = 0;

      descriptor.writeValue(mockData, function() {
        calledback += 1;
      });
      descriptor.emit('valueWrite');
      descriptor.emit('valueWrite');

      calledback.should.equal(1);
    });

  });
});
