import * as migration_20260821_170237_video_media from './20260821_170237_video_media';
import * as migration_20260821_174112_public_media_contract from './20260821_174112_public_media_contract';
import * as migration_20260824_133157_home_landing_positions from './20260824_133157_home_landing_positions';

export const migrations = [
  {
    up: migration_20260821_170237_video_media.up,
    down: migration_20260821_170237_video_media.down,
    name: '20260821_170237_video_media',
  },
  {
    up: migration_20260821_174112_public_media_contract.up,
    down: migration_20260821_174112_public_media_contract.down,
    name: '20260821_174112_public_media_contract',
  },
  {
    up: migration_20260824_133157_home_landing_positions.up,
    down: migration_20260824_133157_home_landing_positions.down,
    name: '20260824_133157_home_landing_positions',
  },
];
