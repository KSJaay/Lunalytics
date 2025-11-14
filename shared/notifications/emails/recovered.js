import React from "react";

const NotificationRecoveredEmailTemplate = ({
  serviceName,
  dashboardUrl,
  timestamp
}) => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
      backgroundColor: '#171a1c',
      padding: '32px 0',
      color: '#f3f6fb'
    }
  }, /*#__PURE__*/React.createElement("table", {
    width: "100%",
    cellPadding: "0",
    cellSpacing: "0",
    style: {
      maxWidth: '600px',
      margin: '0 auto',
      borderRadius: '16px',
      overflow: 'hidden',
      backgroundColor: '#22272a',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      backgroundColor: '#13a452',
      color: '#f3f6fb',
      padding: '20px 0',
      fontSize: '22px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      borderRadius: '16px 16px 0 0'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://raw.githubusercontent.com/KSJaay/Lunalytics/refs/heads/main/public/icon-192x192.png",
    width: '36px',
    height: '36px'
  }), "Lunalytics - Service Restored"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '32px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 12px 0',
      fontSize: '20px',
      fontWeight: '600',
      color: '#17c964'
    }
  }, "\u2705 Your monitored service is back online"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px 0',
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#f3f6fb'
    }
  }, "Lunalytics detected that", ' ', /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#9fa9af'
    }
  }, serviceName), " has successfully recovered and is now", ' ', /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#13a452'
    }
  }, "operational"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 24px 0',
      fontSize: '14px',
      color: '#9fa9af'
    }
  }, "Resolved at: ", timestamp), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: '#171a1c',
      border: '1px solid #22272a',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '28px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '15px',
      color: '#9fa9af',
      lineHeight: '1.6'
    }
  }, "Monitoring will continue to ensure your service remains stable. You\u2019ll be alerted again if any further issues occur.")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '28px 0'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: dashboardUrl,
    style: {
      display: 'inline-block',
      backgroundColor: '#0072f5',
      color: '#f3f6fb',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '15px',
      textDecoration: 'none',
      fontWeight: '600'
    }
  }, "View Dashboard")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0',
      fontSize: '13px',
      color: '#9fa9af',
      textAlign: 'center'
    }
  }, "You can manage notification preferences or review uptime logs in your dashboard.")))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      backgroundColor: '#292e31',
      padding: '16px',
      textAlign: 'center',
      fontSize: '12px',
      color: '#9fa9af',
      borderRadius: '0 0 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/KSJaay/lunalytics",
    style: {
      color: '#13a452'
    },
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Lunalytics"), ' ', "- Made with \u2764\uFE0F by KSJaay")))));
};

export default NotificationRecoveredEmailTemplate;
