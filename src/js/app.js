App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../orders.json', function(data) {
      var ordRow = $('#orderRow');
      var ordTemplate = $('#orderTemplate');

      for (i = 0; i < data.length; i ++) {
        ordTemplate.find('.panel-title').text(data[i].name);
        ordTemplate.find('img').attr('src', data[i].picture);
        ordTemplate.find('.order-quantity').text(data[i].fuel);
        ordTemplate.find('.trailer').text(data[i].reg);
        ordTemplate.find('.location').text(data[i].location);
        ordTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        ordRow.append(ordTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Orders.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var OrdersArtifact = data;
      App.contracts.Orders = TruffleContract(OrdersArtifact);
    
      // Set the provider for our contract
      App.contracts.Orders.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.orderFulfilled();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  orderFulfilled: function(adopters, account) {
    var orderInstance;

App.contracts.Orders.deployed().then(function(instance) {
  orderInstance = instance;

  return orderInstance.getSiteOrders.call();
}).then(function(orders) {
  for (i = 0; i < orders.length; i++) {
    if (orders[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-order').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Orders.deployed().then(function(instance) {
    adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.order(petId, {from: account});
  }).then(function(result) {
    return App.orderFulfilled();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
