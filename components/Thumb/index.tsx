import * as React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { theme } from '../../theme';

import { Loader } from '../Loader';
import { NoCover } from '../NoCover';
import { getImageUrl } from '../../utils/images';

export type ThumbProps = {
  aspectRatio?: number;
  height?: number;
  imageUrl?: string;
  imageWidth?: string
  isLoading?: boolean;
  isRounded?: boolean;
  type: string;
};

export const Thumb = React.memo(
  ({
    aspectRatio = 2 / 3,
    height,
    imageUrl,
    imageWidth,
    isLoading,
    isRounded,
    type
  }: ThumbProps) => {
    return (
      <View style={[styles.wrapper, isRounded && styles.rounded]}>
        <ImageBackground
          source={{
            uri: getImageUrl(imageUrl, imageWidth)
          }}
          style={[
            {
              aspectRatio,
              height
            },
            styles.image
          ]}
        >
          {/* {isLoading ? (
            <Loader style={styles.loading} />
          ) : (
            <>{!imageUrl && <NoCover icon={getIconType(type)} />}</>
          )} */}
        </ImageBackground>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radii.sm,
    overflow: 'hidden'
  },
  rounded: {
    borderRadius: 500
  },
  image: {
    backgroundColor: theme.colors.ahead
  },
  loading: {
    width: '100%'
  }
});
