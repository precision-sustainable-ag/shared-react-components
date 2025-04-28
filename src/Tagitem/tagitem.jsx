import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Chip } from '@mui/material';
import { PSATooltip } from '../Tooltip/tooltip';

export function PSATagitem({
  goalTitle,
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
      updateSelectedGoal(goals.filter(g => g !== item.label));
    }
  };

  const isSelected = selectedGoalsRedux.includes(goalTitle);
  const isDisabled = selectedGoalsRedux.length >= 3 && !isSelected;
  const avatarOrder = isSelected ? selectedGoalsRedux.indexOf(goalTitle) + 1 : null;

  return (
    <PSATooltip
      id={`tooltip-${id}`}
      title={goalDescription}
      placement="top"
      arrow
      enterDelay={1000}
      enterNextDelay={1000}
      tooltipContent={
        <Chip
          id={`chip-${id}`}
          label={goalTitle}
          disabled={isDisabled}
          color={isSelected ? 'primary' : 'secondary'}
          avatar={isSelected ? <Avatar id={`avatar-${id}`}>{avatarOrder}</Avatar> : undefined}
          onClick={() => updateSelectedGoals(goal)}
          size="medium"
          variant="outlined"
          data-test={`goal-tag-${id}`}
          sx={{
            '&.MuiChip-root.Mui-disabled': {
              opacity: 1,
              color: '#757575',
            },
          }}
        />
      }
    />
  );
}

PSATagitem.propTypes = {
  goalTitle: PropTypes.string.isRequired,
  goalDescription: PropTypes.string,
  goal: PropTypes.shape({
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  selectedGoalsRedux: PropTypes.arrayOf(PropTypes.string).isRequired,
  historyStateRedux: PropTypes.string.isRequired,
  pirschAnalytics: PropTypes.func.isRequired,
  addSelectedGoals: PropTypes.func.isRequired,
  updateSelectedGoal: PropTypes.func.isRequired,
  setHistoryState: PropTypes.func.isRequired,
  historyStateEnum: PropTypes.shape({
    imported: PropTypes.string.isRequired,
    updated: PropTypes.string.isRequired,
  }).isRequired,
};

PSATagitem.defaultProps = {
  goalDescription: '',
};

export default PSATagitem;
