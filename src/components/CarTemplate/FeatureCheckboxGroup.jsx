import React from 'react';
import PropTypes from 'prop-types';

function FeatureCheckboxGroup({ category, selectedFeatures, onToggleFeature }) {
    if (!category || !category.features || !category.features.length) {
        return null;
    }

    return (
        <div className="car-template-category mb-4">
            <h5 className="mb-3">{category.name}</h5>
            <div className="row">
                {category.features.map((feature) => {
                    const featureId = String(feature._id);
                    const isChecked = selectedFeatures.includes(featureId);

                    return (
                        <div className="col-md-4 col-sm-6 mb-2" key={featureId}>
                            <label className="d-flex align-items-center gap-2 mb-0">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => onToggleFeature(featureId)}
                                />
                                <span>{feature.name}</span>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

FeatureCheckboxGroup.propTypes = {
    category: PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        name: PropTypes.string,
        features: PropTypes.array
    }),
    selectedFeatures: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggleFeature: PropTypes.func.isRequired
};

export default FeatureCheckboxGroup;
