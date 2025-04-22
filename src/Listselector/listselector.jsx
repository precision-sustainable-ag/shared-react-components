import React from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PSALoadingSpinner } from 'shared-react-components/src'; // or from relative path
import PreviousCashCrop from '../PreviousCashCrop/PreviousCashCrop';
import GoalTag from '../GoalTag/GoalTag'; // You may also need to extract GoalTag to this repo if it isn't already

export function PSAListselector({ allGoals, selectedGoals }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  return (
    <Grid container spacing={isLargeScreen ? 4 : 1}>
    <Grid container item lg={12} spacing={isLargeScreen ? 4 : 1}>
      {/* Goals Section */}
      <Grid item container lg={6} justifyContent={isLargeScreen ? 'flex-end' : 'center'}>
        <Grid
          item
          container
          lg={10}
          sx={{
            boxSizing: 'border-box',
            borderRadius: '15px',
            border: '2px solid #598445',
            p: '1rem',
            margin: !isLargeScreen ? '1rem' : '0',
          }}
          data-test="goals-card"
        >
          <Grid item xs={12}>
            <Typography variant="h4" align="center">Goals</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant={isMobile ? 'subtitle2' : 'subtitle1'}
              align="center"
              gutterBottom
            >
              Select up to 3 goals in order of importance.
            </Typography>
          </Grid>
          <Grid item xs={12} mb={2}>
            <Typography variant="subtitle2" align="center" gutterBottom>
              Tap and hold for more information
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '100px',
            }}
          >
            {allGoals?.length > 0 ? (
              allGoals
                .slice()
                .sort((a, b) =>
                  (selectedGoals.indexOf(a.label) === -1 ? 3 : selectedGoals.indexOf(a.label)) -
                  (selectedGoals.indexOf(b.label) === -1 ? 3 : selectedGoals.indexOf(b.label))
                )
                .map((goal, key) => (
                  <GoalTag
                    key={goal.label}
                    goal={goal}
                    id={key}
                    goalTitle={goal.label}
                    goalDescription={goal.description}
                  />
                ))
            ) : (
              <PSALoadingSpinner />
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Previous Cash Crop */}
      <Grid item container lg={6}>
        <Grid
          item
          container
          lg={10}
          sx={{
            boxSizing: 'border-box',
            borderRadius: '15px',
            border: '2px solid #598445',
            p: '1rem',
            mr: !isLargeScreen ? '1rem' : '0',
            ml: !isLargeScreen ? '1rem' : '0',
            mb: !isLargeScreen ? '1rem' : '0',
          }}
          justifyContent="center"
        >
          <PreviousCashCrop />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);
}

/* Define Props Type */

PSAListselector.propTypes = {
  allGoals: PropTypes.array.isRequired,
  selectedGoals: PropTypes.array.isRequired,
};