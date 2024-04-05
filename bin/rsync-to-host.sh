rsync --no-compress -S  \
  --exclude 'untracked' \
  --exclude 'node_modules' \
  --exclude 'tsconfig.tsbuildinfo' \
  --exclude '.next' \
  -a --progress --delete /app/ /host_fs
