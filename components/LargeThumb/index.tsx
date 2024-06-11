import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { globalStyles } from '../../styles';
import { theme } from '../../theme';


import { Gradient } from '../Gradient';
import { Text } from '../Text';
import { Thumb } from '../Thumb';

import { getImageUrl } from '../../utils/images';




export type StaticLargeThumbProps = {
  id: number;
  imageUrl?: string;
  imageWidth?: string;
  title?: string;
  type: string;
  logoUrl?: string; // URL of the logo image if available
  logoAspectRatio?: number; // Aspect ratio of the logo image
};

export const LargeThumb = React.memo(
  ({
    id,
    imageUrl,
    imageWidth = 'w780',
    title,
    type,
    logoUrl,
    logoAspectRatio
  }: StaticLargeThumbProps) => {
    return (
      <View style={styles.wrapper}>
        <Thumb
          imageUrl={imageUrl}
          imageWidth={imageWidth}
          type={type}
          aspectRatio={16 / 12}
        />
        <View style={[globalStyles.absoluteFill, styles.content]}>
          <Gradient colors={['transparent', theme.colors.behind]} />
          {logoUrl && (
            <Image
              style={[styles.logo, { aspectRatio: logoAspectRatio }]}
              src={getImageUrl(logoUrl, 'w500')}
            />
          )}
          {!logoUrl && title && (
            <Text numberOfLines={2} variant="h0" style={styles.title}>
              {title}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radii.xxl,
    width: '100%',
    overflow: 'hidden',
    marginBottom: theme.space.lg
  },
  content: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  title: {
    paddingHorizontal: theme.space.lg,
    paddingBottom: theme.space.sm,
    textAlign: 'center'
  },
  loading: {
    width: '100%'
  },
  logo: {
    width: 250,
    maxHeight: 100,
    marginBottom: theme.space.lg
  }
});
