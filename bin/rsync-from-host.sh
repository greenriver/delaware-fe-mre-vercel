rsync --no-compress -S  \
  --exclude 'untracked' \
  --exclude 'node_modules' \
  --exclude 'tsconfig.tsbuildinfo' \
  --exclude '.next' \
  --exclude '.env.local' \
  -a --progress --delete /host_fs/ /app