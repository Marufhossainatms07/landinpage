const PaymentGateways = ({ gateways, selectedGateway, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {gateways.map(gateway => (
        <div 
          key={gateway._id}
          className={`cursor-pointer p-4 rounded-lg border-2 ${
            selectedGateway?._id === gateway._id 
              ? 'border-primary bg-blue-50' 
              : 'border-gray-200 hover:border-primary'
          }`}
          onClick={() => onSelect(gateway)}
        >
          <div className="flex items-center gap-4">
            <img 
              src={gateway.logo} 
              alt={gateway.name}
              className="w-16 h-16 object-contain"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800">{gateway.name}</h3>
              <p className="text-sm text-gray-600">{gateway.accountNumber}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentGateways;