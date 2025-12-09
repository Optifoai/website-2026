import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import Button from '../../common/Button/Button';
import Button from '../../common/Button/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import logo from '/images/logo.png';


function SideBar(props) {
    const { user, logout } = useAuth();
    const { userDetails } = props
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside class="sidebar" role="navigation" aria-label="Main sidebar">
            <div class="top-strip">
                <div class="logo-wrap" aria-hidden="true">
                    <div class="logo-lens"></div>
                </div>

                <img src={logo ? logo:''} alt="Optifo Logo"/>
                {/* <img src="/images/logo.png" alt="Optifo Logo" /> */}
                <div>   <img src="title.png" /></div>



            </div>

            <ul class="" aria-label="Primary">
                <li>
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`} role="button" tabIndex="0" aria-current>
                        <div class="icon"><img src="dashboard.svg" /></div>
                        <span>{t('sidebarDashboard')}</span>
                    </Link>
                </li>
                <li>
                    <Link to="/my-account" className={`nav-item ${location.pathname === '/my-account' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/my-account' ? "my-account-active.svg" : "my-account.svg"} />
                        </div>
                        <span>{t('sidebarMyAccount')}</span>
                    </Link>

                </li>
                {/* new */}
                <li>
                    <Link to="/background-logo" className={`nav-item ${location.pathname === '/background-logo' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/background-logo' ? "background-logo-active.svg" : "background-logo.svg"} />
                        </div>
                        <span>{t('sidebarBackgroundLogo')}</span>
                    </Link>

                </li>
                <li>
                    <Link to="/create-car" className={`nav-item ${location.pathname === '/create-car' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/create-car' ? "credits-active.svg" : "credits.svg"} />

                        </div>
                        <span>{t('create_car')}</span>
                    </Link>

                </li>
                <li>
                    <Link to="/create-background" className={`nav-item ${location.pathname === '/create-background' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/create-background' ? "credits-active.svg" : "credits.svg"} />

                        </div>
                        <span>{t('create_bg_text')}</span>
                    </Link>

                </li>
                <li>
                    <Link to="/brand" className={`nav-item ${location.pathname === '/brand' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/brand' ? "credits-active.svg" : "credits.svg"} />

                        </div>
                        <span>{t('car_brand')}</span>
                    </Link>

                </li>

                <li>
                    <Link to="/credits" className={`nav-item ${location.pathname === '/credits' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/credits' ? "credits-active.svg" : "credits.svg"} />

                        </div>
                        <span>{t('sidebarCredits')}</span>
                    </Link>

                </li>

                <li>
                    <Link to="/billing" className={`nav-item ${location.pathname === '/billing' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon"><img src="billing.svg" /></div>
                        <span>{t('sidebarBilling')}</span>
                    </Link>

                </li>

                {/* old */}
                {/* <li>
                    <a class="nav-item" role="button" tabindex="0">
                        <div class="icon"><img src="background-logo.svg" /></div>
                        <span>Background &amp; Logo</span>
                    </a>
                </li>
                <li>
                    <a class="nav-item" role="button" tabindex="0">
                        <div class="icon"><img src="credits.svg" /></div>
                        <span>Credits</span>
                    </a>
                </li>
                <li>
                    <a class="nav-item" role="button" tabindex="0">
                        <div class="icon"><img src="billing.svg" /></div>
                        <span>Billing Info</span>
                    </a>
                </li> */}

                <div class="nav-divider"></div>
            </ul>

            <div class="bottom" aria-hidden="false">
                <div class="credits" title="Credits left">
                    <div class="coin"> <img src="coin.svg" /></div>
                    <div>
                        <div class="meta">960 / 1k <span class="muted">Credits Left</span></div>

                    </div>
                </div>

                <div class="profile" title="Account">
                    <div class="avatar"><img src="user.png" /></div>
                    <div>
                        <div class="info">{'User'}</div>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    <div class="caret" aria-hidden="true"></div>
                </div>
            </div>

        </aside>
    );
}

export default SideBar;