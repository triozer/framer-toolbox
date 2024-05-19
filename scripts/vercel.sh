git diff HEAD^ HEAD --quiet -- $1
diff_exit_code=$?

if [ "$VERCEL_ENV" == "production" ] || [ $diff_exit_code -eq 1 ]; then
  exit 1
else
  exit 0
fi