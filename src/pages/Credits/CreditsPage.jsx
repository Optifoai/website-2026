import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

function CreditsPage(props) {
const { t } = useTranslation();


    const [isDenmark, setIsDenmark] = useState(false);

    useEffect(() => {
        // Get the browser's preferred language(s)
        const browserLocale = navigator.language || navigator.languages[0];
    
        // Validate if the user is from Denmark or speaks Danish
        const isDanish = browserLocale.startsWith('da'); // checks for 'da' (Danish)
        const isFromDenmark = browserLocale.endsWith('DK'); // checks for 'DK' (Denmark)
    
        // Set state based on validation
        if (isDanish && isFromDenmark) {
          setIsDenmark(true);
        }

    }, []);
    
    function getPaymentLink(isDenmark) {
        if (isDenmark) {
          return 'https://buy.stripe.com/00gcPxbqM2ua5Pi7su?locale=da'; // Danish payment link
        }
        return 'https://buy.stripe.com/28o02LamI3ye3Ha147'; // Default payment link
    }

    function getUnlimitedPackLink(isDenmark) {
        if (isDenmark) {
          return 'https://buy.stripe.com/9AQcPx7aw5Gm4LebIN?locale=da'; // Danish payment link
        }
        return 'https://buy.stripe.com/fZecPxamI6Kq3Ha9AE'; // Default payment link
    };


  return (
    <>


      <div className="bg-gradient">
        <h3 className='heading-title'>Credit Packs</h3>
        <p className='heading-subtitle'>Select the credit pack that gives your dealer the most value..</p>
      </div>
      <section className="card-block-credit" aria-label="Preview Card">
        <div className="pricing-card">
          <div className="price-section">
            <h2 className="price">€89</h2>
            <p className="subtext"> per month</p>
          </div>

          <div className="divider"></div>

          <div className="credits-section">
            <h3 className="credit">500 </h3>
            <p className="credits-label">{t('credits_text')}</p>
          </div>

          {/* <p className="tax-note">All prices are exclusive tax.</p> */}

          <button className="buy-btn"  onClick={() => window.location.href = getPaymentLink(isDenmark)} >{t('subscribe_text')}</button>
        </div>

        <div className="pricing-card">
          <div className="price-section">
            <h2 className="price">€129</h2>
            <p className="subtext"> per month</p>
          </div>

          <div className="divider"></div>

          <div className="credits-section">
            <h3 className="credit">Unlimited</h3>
            <p className="credits-label">{t('credits_text')}</p>
          </div>

          {/* <p className="tax-note">All prices are exclusive tax.</p> */}

          <button className="buy-btn" onClick={() => window.location.href = getUnlimitedPackLink(isDenmark)}>{t('subscribe_text')}</button>
        </div>

        {/* <div className="pricing-card">
          <div className="price-section">
            <h2 className="price">399<span className="currency">/kr.</span></h2>
            <p className="subtext">3.99 kr. / Credit</p>
          </div>

          <div className="divider"></div>

          <div className="credits-section">
            <h3 className="credit">100</h3>
            <p className="credits-label">CREDITS</p>
          </div>

          <p className="tax-note">All prices are exclusive tax.</p>

          <button className="buy-btn">Buy Pack</button>
        </div> */}

      </section>


      {/* <div className="auto-refill-card">
        <div className="text-group">
          <h3>Automatic Refill</h3>
          <p>Never run out of credits with automatic refills. Optifo will refill with recent bought pack.</p>
        </div>

        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </div> */}




    </>
  );
}

CreditsPage.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  loader: PropTypes.bool,
  userDetails: EMPTY_OBJECT,

}

CreditsPage.defaulProps = {
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

export default connect(mapStateToProps)(CreditsPage)