import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import { useTranslation } from 'react-i18next';

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

  return (
      <div class="topbar">
                <div class="title">
                    <h2>RECENT CARS</h2>
                    {/* <button class="chip"><img src="filter.png" /> Filter</button> */}
                </div>

                {/* <div class="controls">
                    <button class="small-btn"><img src="three-dots.png" /> More</button>
                    <div>
                        <button class="small-btn"><img src="tile.svg" /></button>
                        <button class="small-btn"><img src="menubar.svg" /></button>
                    </div>
                    <div className="language-switcher">
                        <button onClick={() => i18n.changeLanguage('en')} disabled={i18n.language === 'en'}>English</button>
                        <button onClick={() => i18n.changeLanguage('da')} disabled={i18n.language === 'da'}>Dansk</button>
                    </div>
                </div> */}
            </div>
  );
}

export default Header;