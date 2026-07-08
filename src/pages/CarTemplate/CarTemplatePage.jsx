import React, { useEffect, useReducer } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';

import LoaderSpiner from '../../hooks/LoaderSpiner';

import Button from '../../components/common/Button/Button';

import { notify } from '../../utils/helpers';

import { getTemplate, saveTemplate } from '../../services/vendorCarTemplate.service';



function CarTemplatePage({ navigate }) {

    const { t } = useTranslation();

    const [state, setState] = useReducer(

        (prev, next) => ({ ...prev, ...next }),

        {

            loader: true,

            saving: false,

            mainDescription: '',

            initialSnapshot: null

        }

    );



    const loadPageData = async () => {

        setState({ loader: true });



        try {

            const templateRes = await getTemplate();



            if (templateRes?.statusCode != 1) {

                notify('error', templateRes?.error?.responseMessage || t('carTemplateLoadError'));

                setState({ loader: false });

                return;

            }



            const template = templateRes?.responseData?.result || {};

            const snapshot = {

                mainDescription: template.main_description || ''

            };



            setState({

                loader: false,

                mainDescription: snapshot.mainDescription,

                initialSnapshot: snapshot

            });

        } catch (error) {

            setState({ loader: false });

            notify('error', error?.error?.responseMessage || error?.responseMessage || t('carTemplateLoadError'));

        }

    };



    useEffect(() => {

        loadPageData();

    }, []);



    const handleSave = async () => {

        setState({ saving: true });



        try {

            const payload = {

                main_description: state.mainDescription

            };



            const response = await saveTemplate(payload);



            if (response?.statusCode == 1) {

                const saved = response?.responseData?.result || payload;

                const snapshot = {

                    mainDescription: saved.main_description || ''

                };



                setState({

                    saving: false,

                    mainDescription: snapshot.mainDescription,

                    initialSnapshot: snapshot

                });



                notify('success', response?.responseData?.message || t('carTemplateSaveSuccess'));

            } else {

                setState({ saving: false });

                notify('error', response?.error?.responseMessage || t('carTemplateSaveError'));

            }

        } catch (error) {

            setState({ saving: false });

            notify('error', error?.error?.responseMessage || error?.responseMessage || t('carTemplateSaveError'));

        }

    };



    const handleCancel = () => {

        if (state.initialSnapshot) {

            setState({

                mainDescription: state.initialSnapshot.mainDescription

            });

            return;

        }



        navigate('/dashboard');

    };



    if (state.loader) {

        return <LoaderSpiner />;

    }



    return (

        <section className="car-template-page flex-1 mt-4">

            <h3 className="car-template-title mb-4">{t('carTemplateTitle')}</h3>



            <div className="car-template-section mb-4">

                <label className="form-label">{t('carTemplateMainDescription')}</label>

                <textarea

                    className="form-control car-template-textarea"

                    rows="4"

                    name="main_description"

                    value={state.mainDescription}

                    onChange={(e) => setState({ mainDescription: e.target.value })}

                    placeholder={t('carTemplateMainDescriptionPlaceholder')}

                />

            </div>



            <div className="car-template-actions d-flex gap-3">

                <Button

                    type="button"

                    className="btn btn-primary"

                    disabled={state.saving}

                    onClick={handleSave}

                >

                    {state.saving ? t('SavingText') : t('SaveText')}

                </Button>

                <Button

                    type="button"

                    className="btn btn-secondary"

                    disabled={state.saving}

                    onClick={handleCancel}

                >

                    {t('cancelText')}

                </Button>

            </div>

        </section>

    );

}



CarTemplatePage.propTypes = {

    navigate: PropTypes.func

};



export default connect()(CarTemplatePage);

