import React from 'react';
import { Avatar, Chip } from '@mui/material';
import { PSATooltip } from 'shared-react-components/src';
import PropTypes from 'prop-types';

/**
 * A tag component with optional avatar, tooltip, and click behavior
 * that supports a selection limit and analytics.
 */
export function PSATagitem({
  goaltTitle,
  goalDescription,
  goal,
  id,
  selectedGoalsRedux,
  historyStateRedux,
  pirschAnalytics,
  addSelectedGoals,
  updateSelectedGoal,
  setHistoryState,
  historyStateEnum,
}) {
  const updateSelectedGoals = (item) => {
    if (historyStateRedux === historyStateEnum.imported) {
      setHistoryState(historyStateEnum.updated);
    }

    const goals = [...selectedGoalsRedux];

    if (!goals.includes(item.label)) {
      addSelectedGoals(item.label);
      pirschAnalytics('Goals', { meta: { goal: item.label } });
    } else {
      const updatedGoals = goals.filter(g => g !== item.label);
      updateSelectedGoal(updatedGoals);
    }
  };

  return (
    <PSATooltip
      enterDelay={1000}
      enterNextDelay={1000}
      id={`tooltip-${id}`}
      placement="top"
      arrow
      title={goalDescription}
      tooltipContent={(
        <span>
          <Chip
            disabled={selectedGoalsRedux.length >= 3 && !selectedGoalsRedux.includes(goaltTitle)}
            color={selectedGoalsRedux.includes(goaltTitle) ? 'primary' : 'secondary'}
            avatar={
              selectedGoalsRedux.includes(goaltTitle) ? (
                <Avatar id={`avatar-${id}`}>{selectedGoalsRedux.indexOf(goaltTitle) + 1}</Avatar>
              ) : null
            }
            label={goaltTitle}
            onClick={() => updateSelectedGoals(goal)}
            key={`chip-${id}`}
            id={`chip-${id}`}
            size="medium"
            variant="outlined"
            data-test={`goal-tag-${id}`}
            sx={{
              '&.MuiChip-root:focus': {
                '&.Mui-disabled': {
                  color: '#757575',
                },
              },
              '&.Mui-disabled': {
                opacity: 1,
                color: '#757575',
              },
            }}
          />
        </span>
      )}
    />
  );
}

PSATagitem.propTypes = {
  goaltTitle: PropTypes.string.isRequired,
  goalDescription: PropTypes.string,
  goal: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  selectedGoalsRedux: PropTypes.array.isRequired,
  historyStateRedux: PropTypes.string.isRequired,
  pirschAnalytics: PropTypes.func.isRequired,
  addSelectedGoals: PropTypes.func.isRequired,
  updateSelectedGoal: PropTypes.func.isRequired,
  setHistoryState: PropTypes.func.isRequired,
  historyStateEnum: PropTypes.shape({
    imported: PropTypes.string,
    updated: PropTypes.string,
  }).isRequired,
};

export default PSATagitem;
