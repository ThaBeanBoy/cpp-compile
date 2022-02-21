#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

import { mkDir, dispFilesInDir } from './helpers';

const compile = () => {
  mkDir('./source');
  mkDir('./bin');
  mkDir('./bin/oFiles');
};

export { compile };
