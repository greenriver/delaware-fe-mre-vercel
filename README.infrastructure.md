# Infrastructure and System-Level Notes

This application can be viewed via the rails application at
myhealthycommunity.dhss.delaware.gov, and the high-level details are presented
below. This information applies to the staging and demo environments as well.

## Deployment

See [README.md](README.md)

## Nginx

Nginx on the servers proxy a subset of the requests from
myhealthycommunity.dhss.delaware.gov to the built Vercel app. The nginx
configuration is managed in ansible and is tagged with `vhost`. See
git@github.com:greenriver/ansible-fresh.git in various places, but most
importantly at `/roles/web/templates/nginx.vhost.delaware.conf.j2`

## Vercel Environment

The vercel environment variables that are used during build and runtime are
managed in terraform in the git@github.com:greenriver/terraform.git repository
at `aws/terraform/live/delaware/vercel`. If you need to modify them, contact the dev ops
team.
