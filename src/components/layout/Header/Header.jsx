import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const getTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return t('recentCars');   
      case '/my-account':
        return t('sidebarMyAccount');
      case '/car-template':
        return t('carTemplateTitle');
      case '/background-logo':
        return t('sidebarBackgroundLogo');
      case '/create-car':
        return t('create_car');
      case '/create-background':
        return t('create_bg_text');
      case '/brand':
        return t('car_brand');
      case '/credits':
        return t('sidebarCredits');
      case '/plat-banner':
      return t('create_plat_banner_text');  
      default:
        return t('carDetails');
    }
  };

  return (
      <div className="topbar">
                <div className="title">
                  {location.pathname === '/create-car' ? 
                  <button onClick={() => window.location.reload()} className="back-button" aria-label="Go back"><img src='/images/icon/back.png'/></button>
                  :
                  <button onClick={() => navigate(-1)} className="back-button" aria-label="Go back"><img src='/images/icon/back.png'/></button>
                  }
                    
                    <h2>{getTitle()}</h2>
                </div>
                {isAuthenticated && (
                  <NotificationBell userId={user?._id || user?.id} />
                )}
            </div>
  );
}

export default Header;