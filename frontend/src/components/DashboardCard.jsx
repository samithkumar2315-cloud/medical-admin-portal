const DashboardCard = ({ title, value, icon, colorClass = 'primary' }) => {
  return (
    <div className="stat-card" id={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={`stat-card-icon ${colorClass}`}>
        {icon}
      </div>
      <div className="stat-card-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
