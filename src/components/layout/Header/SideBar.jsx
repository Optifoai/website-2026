import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../common/Button/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import logo from '/images/logo.png';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT } from '../../../utils/helpers';
import { getUserProfile } from '../../../services/auth';



function SideBar(props) {
    const { user, logout, getUserData } = useAuth();
    const { userDetails } = props
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        getUserData()
    }, [!user, user == null])

    return (
        <aside class="sidebar" role="navigation" aria-label="Main sidebar">
            <div class="top-strip">
                <div class="logo-wrap" aria-hidden="true">
                    <div class="logo-lens"></div>
                </div>

                <img src={logo ? logo : ''} alt="Optifo Logo" />
                {/* <img src="/images/logo.png" alt="Optifo Logo" /> */}
                <div>   <img src="/images/title.png" /></div>



            </div>

            <ul class="" aria-label="Primary">
                <li>
                    <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`} role="button" tabIndex="0" aria-current>
                        <div class="icon">
                             <img src={location.pathname === '/dashboard' ? "/images/dashboard-active.svg" : "/images/dashboard-deactivate.svg"} />
                        </div>
                        <span>{t('sidebarDashboard')}</span>
                    </Link>
                </li>
                <li>
                    <Link to="/my-account" className={`nav-item ${location.pathname === '/my-account' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/my-account' ? "/images/my-account-active.svg" : "/images/my-account.svg"} />
                        </div>
                        <span>{t('sidebarMyAccount')}</span>
                    </Link>

                </li>
                 <li>
                    <Link to="/create-car" className={`nav-item ${location.pathname === '/create-car' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/create-car' ? "/images/create-car-active.png" : "/images/create-car-deactive.png"} />

                        </div>
                        <span>{t('create_car')}</span>
                    </Link>

                </li>
                {/* new */}
                <li>
                    <Link to="/background-logo" className={`nav-item ${location.pathname === '/background-logo' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/background-logo' ? "/images/background-logo-active.svg" : "/images/background-logo.svg"} />
                        </div>
                        <span>{t('sidebarBackgroundLogo')}</span>
                    </Link>

                </li>
                 <li>
                    <Link to="/plat-banner" className={`nav-item ${location.pathname === '/plat-banner' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/plat-banner' ? "/images/background-logo-active.svg" : "/images/background-logo.svg"} />
                        </div>
                        <span>{t('create_plat_banner_text')}</span>
                    </Link>

                </li>
               
                <li>
                    <Link to="/create-background" className={`nav-item ${location.pathname === '/create-background' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/create-background' ? "/images/background-logo-active.svg" : "/images/background-logo.svg"} />

                        </div>
                        <span>{t('create_bg_text')}</span>
                    </Link>

                </li>
             
                {/* <li>
                    <Link to="/brand" className={`nav-item ${location.pathname === '/brand' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/brand' ? "/credits-active.svg" : "/credits.svg"} />

                        </div>
                        <span>{t('car_brand')}</span>
                    </Link>

                </li> */}

                <li>
                    <Link to="/credits" className={`nav-item ${location.pathname === '/credits' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon">
                            <img src={location.pathname === '/credits' ? "/images/credits-active.svg" : "/images/credits.svg"} />

                        </div>
                        <span>{t('sidebarCredits')}</span>
                    </Link>

                </li>

                {/* <li>
                    <Link to="/billing" className={`nav-item ${location.pathname === '/billing' ? 'active' : ''}`} role="button" tabIndex="1" aria-current>
                        <div class="icon"><img src="billing.svg" /></div>
                        <span>{t('sidebarBilling')}</span>
                    </Link>

                </li> */}

         

                <div class="nav-divider"></div>
            </ul>

            <div class="bottom" aria-hidden="false">
                <div class="credits" title="Credits left">
                    <div class="coin"> <img src="/images/coin.svg" /></div>
                    <div>
                        <div class="meta">{((user?.userProfile?.creditsLeft ? user?.userProfile?.creditsLeft : 0) + (user?.userProfile?.leftPackCredits ? user?.userProfile?.leftPackCredits : 0))} <span class="muted">{t('credits_left')}</span></div>

                        {/* <div class="meta">{user?.userProfile?.leftCredits} / {user?.userProfile?.totalCredits} <span class="muted">{t('credits_left')}</span></div> */}

                    </div>
                </div>

                <div className="profile-wrapper">
                    <div className="profile" onClick={() => setOpen(!open)}>
                        <div className="avatar">
                            <img src="/images/user.png" alt="User" />
                        </div>

                        <div className="info">
                            {user?.userProfile?.fullName || "User"}
                        </div>

                        <div className="caret"><img src='/images/caret.png'/></div>
                    </div>

                    {open && (
                        <div className="profile-dropdown">
                            <ul>
                                <li className="logout" onClick={handleLogout}>
                                    {t('Logout_text')}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* <div class="profile" title="Account">
                    <div class="avatar"><img src="user.png" /></div>
                    <div>
                        <div class="info">{user?.userProfile?.fullName ? user?.userProfile?.fullName : 'User'}</div>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    <div class="caret" aria-hidden="true">▼</div>
                </div> */}
            </div>

        </aside>
    );
}

SideBar.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,

}

SideBar.defaulProps = {
    dispatch: PropTypes.func,
    data: EMPTY_OBJECT,
    userDetails: EMPTY_OBJECT,
    loader: PropTypes.bool,

}

function mapStateToProps({ login }) {

    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
    }
}
export default connect(mapStateToProps)(SideBar)

// export default SideBar;