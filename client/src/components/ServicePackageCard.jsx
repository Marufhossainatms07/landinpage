import './ServicePackageCard.css';

const ServicePackageCard = ({ name, features, targetClient, price }) => {
    return (
        <div className="service-package-card">
            <h3>{name}</h3>
            <p className="target-client">For: {targetClient}</p>
            <ul className="features-list">
                {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
            <p className="price">{price}</p>
            <button className="choose-package-button">Choose Package</button>
        </div>
    );
};

export default ServicePackageCard;