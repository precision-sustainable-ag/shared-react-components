import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box, Card, CardContent, CardActions, Dialog, DialogTitle, IconButton, Typography, Link,
} from '@mui/material';
import { Close, Info, PlaylistAdd, PlaylistRemove, OpenInNew } from '@mui/icons-material';
import PSAFigmaButton from '../FigmaButton';
import { PSAInfoSheet } from '../InfoSheet';

export const PSACropImage = ({
  alt = 'image',
  thumbnail,
  fullsize = thumbnail,
  portrait,
  credits,
  creditsSimple = credits,
  inDetails,
  openDetails=() => {},
  isMobile,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      {
        thumbnail
        && (
          <Box
            sx={{
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
              width: inDetails ? 260 : '100%',
              aspectRatio: 260 / 140,
              cursor: 'pointer',
              borderRadius: 2,
              border: '1px solid #ddd',
            }}
            onClick={() => {
              if (!inDetails) openDetails(true);
              else setOpen(true);
            }}
          >
            <Box
              component="img"
              sx={{
                position: 'absolute',
                top: portrait ? 0 : '50%',
                left: '50%',
                width: '100%',
                transform: portrait ? 'translate(-50%, -25%)' : 'translate(-50%, -50%)',
                objectFit: 'cover',
              }}
              src={thumbnail}
              alt={alt}
              title={isMobile ? 'Click for details' : 'Click to view full size'}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/260x140?text=Placeholder';
              }}
            />
          </Box>
        )
      }
      {
        creditsSimple
        && (
          <Typography
            sx={{
              fontSize: 12,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              cursor: 'pointer',
              padding: '0.2rem',
              background: '#f0f0f0',
              ':hover': {
                textDecoration: 'underline',
              },
            }}
            title="Click to view full-size image and complete credits"
            onClick={() => setOpen(true)}
          >
            {creditsSimple}
          </Typography>
        )
      }

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xl"
        width="100%"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Box
          component="img"
          src={fullsize}
          alt={alt}
          sx={{
            maxHeight: 'calc(100vh - 100px)',
            display: 'block',
            border: '25px solid white',
            borderTop: '10px solid white',
            borderBottom: 'none',
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/260x140?text=Placeholder';
          }}
        />
        {
          credits
          && (
            <Typography sx={{ fontSize: 14, margin: '0 25px' }}>
              {credits}
            </Typography>
          )
        }
      </Dialog>
    </Box>
  );
}; // PSACropImage

const Header = ({ species, scientific, cultivar, }) => (
  <Box
    sx={{
      padding: '0.5rem 1rem',
      background: 'white',
      minHeight: 50,
    }}
  >
    <Typography component="span">
      {species}
    </Typography>

    <Typography sx={{ fontStyle: 'italic', fontSize: 14 }}>
      {scientific}
    </Typography>

    {
      cultivar
      && (
        <Typography sx={{ fontSize: 14 }} className="cultivar">
          Cultivar:&nbsp;
          {cultivar}
        </Typography>
      )
    }
  </Box>
); // Header

const Content = ({
  scientific, content, symbol,
  thumbnail, fullsize = thumbnail, portrait,
  credits, creditsSimple = credits, openDetails, isMobile,
}) => (
  <Box role="presentation" sx={{ fontFamily: 'IBM Plex Sans' }}>
    <PSACropImage
      alt={scientific}
      symbol={symbol}
      thumbnail={thumbnail}
      fullsize={fullsize}
      creditsSimple={creditsSimple}
      credits={credits}
      portrait={portrait}
      openDetails={openDetails}
      isMobile={isMobile}
    />
    {
      content
      && (
        <Box
          sx={{
            padding: '0.5rem 0rem',
            background: 'white',
            fontSize: 12,
          }}
        >
          {content}
        </Box>
      )
    }
  </Box>
); // Content

/**
 * This is a custom CropCard component.
 *  Styling is based on [Figma](https://www.figma.com/design/dipljCC6Z3GZBFhJqth7a7/PSI-Design-Work?node-id=1799-21980&p=f&t=iJHZVtdpK3LNpTW8-0).
  */
export const PSACropCard = ({
  species,
  cultivar,
  scientific,
  content,
  details,
  thumbnail,
  fullsize,
  portrait,
  externalLink,
  externalLinkText,
  externalLinkTitle,
  credits,
  creditsSimple,
  title,
  onSelect,
  onRemove,
  selected,
  sx,
  infoSheetProps = {},
  ...props
}) => {
  const elementRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 600);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
    );

    if (elementRef.current) {
      const c = elementRef.current;
      setTimeout(() => {
        observer.observe(c);
      }, 10);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef, elementRef.current]);

  const speciesBox = (
    <Box>
      {
        !selected && onSelect
        && (
          <PSAFigmaButton
            text={
              <>
                ADD&nbsp;TO<br />LIST&nbsp;<PlaylistAdd sx={{ fontSize: 15, transform: 'translateY(0.2rem)' }} />
              </>
            }
            variant="color"
            rightIcon
            textSx={{ fontSize: isMobile ? 16 : 12, textAlign: 'left' }}
            buttonSx={{ borderRadius: '5px', padding: '5px 7px', float: 'right' }}
            onClick={onSelect}
          />
        )
      }
      {
        selected && onRemove
        && (
          <PSAFigmaButton
            text={
              <>
                Remove<br /><PlaylistRemove sx={{ fontSize: 15, transform: 'translateY(0.2rem)' }} />
              </>
            }
            rightIcon
            textSx={{ fontSize: isMobile ? 16 : 12, color: 'white' }}
            buttonSx={{
              borderRadius: '5px',
              padding: '5px 7px',
              background: '#565656',
              color: 'white',
              float: 'right',
              '&:hover': {
                background: '#999',
              },
            }}
            onClick={onRemove}
          />
        )
      }

      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.3,
        }}
      >
        <Typography sx={{ lineHeight: '1.2rem', fontWeight: 'bold' }} data-test="crop-card-label">
          {species}
        </Typography>
      </Box>
    </Box>
  );

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card
      sx={[
        {
          borderRadius: '17px',
          width: isMobile ? 160 : 260,
          height: '100%',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
        sx,
      ]}
      {...props}
      ref={elementRef}
    >
      {
        (!isIntersecting && !onRemove)
          ? (
            <div style={{ color: 'white' }}>
              {species}
              {scientific}
              Cultivar
              {cultivar}
            </div>
          )
          : (
            <>
              <Header species={speciesBox} scientific={scientific} cultivar={cultivar}/>
              <Box sx={{ marginTop: 'auto' }}>
                <CardContent sx={{ padding: 0 }}>
                  <Content
                    scientific={scientific}
                    content={content}
                    thumbnail={isIntersecting && thumbnail}
                    fullsize={isIntersecting && fullsize}
                    portrait={portrait}
                    creditsSimple={creditsSimple}
                    credits={credits}
                    openDetails={setOpen}
                    isMobile={isMobile}
                  />
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: isMobile || !externalLink ? 'center' : 'space-between',
                    marginTop: 'auto',
                  }}
                >
                  {
                    details
                    && !isMobile
                    && (
                      <PSAFigmaButton
                        text="DETAILS"
                        icon={<Info sx={{ fontSize: '14px !important', marginLeft: '0.3rem', color: 'green' }} />}
                        rightIcon
                        textSx={{ fontSize: 12 }}
                        buttonSx={{ borderRadius: '5px' }}
                        onClick={() => setOpen(true)}
                      />
                    )
                  }

                  {
                    externalLink
                    && (
                      <Link
                        href={externalLink}
                        title={externalLinkTitle}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          fontSize: 12,
                          fontFamily: 'IBM Plex Sans',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: '#bbffbb',
                          color: 'black',
                          padding: '0.3rem 0.7rem',
                          borderRadius: '5px',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {externalLinkText}
                        <OpenInNew sx={{ fontSize: '0.9em' }} />
                      </Link>
                    )
                  }

                </CardActions>
                {
                  open
                    ? (
                      <PSAInfoSheet
                        setOpen={setOpen}
                        open={open}
                        content={details}
                        title={title}
                        {...infoSheetProps}
                      />
                    )
                    : null
                }
              </Box>
            </>
          )
      }
    </Card>
  );
}; // PSACropCard

/** PropTypes for better type checking */
PSACropCard.propTypes = {
  /** Common name for the species (required) */
  species: PropTypes.string.isRequired,
  /** The cultivar name. */
  cultivar: PropTypes.string,
  /** The scientific name. */
  scientific: PropTypes.string,
  /** Brief information about the species, which will appear on the card. */
  content: PropTypes.node,
  /** Complete details about the species, which will appear in a modal. */
  details: PropTypes.node,
  /** URL to thumbnail image. */
  thumbnail: PropTypes.string,
  /** URL to fullsize image. (defaults to thumbnail) */
  fullsize: PropTypes.string,
  /** Whether original image is taller than it is wide.  The resulting image will appear in landscape, and this will affect its CSS. */
  portrait: PropTypes.bool,
  /** A link to an external site. Used in VegSpec. */
  externalLink: PropTypes.string,
  /** The text that should appear for the external link. */
  externalLinkText: PropTypes.string,
  /** The title that should appear when hovering over the external link. */
  externalLinkTitle: PropTypes.string,
  /** Full credits for the image. */
  credits: PropTypes.string,
  /** Simple credits for the image. (defaults to credits) */
  creditsSimple: PropTypes.string,
  /** Function to add the species to the selected list. */
  onSelect: PropTypes.func,
  /** Function to remove the species from the selected list. */
  onRemove: PropTypes.func,
  /** True if the species has been selected.  Determines whether the **Add To List** or **Remove** button is displayed. */
  selected: PropTypes.bool,
  /** Styling for the CropCard. */
  sx: PropTypes.object,
  /** Props for the InfoSheet */
  infoSheetProps: PropTypes.object,
};
