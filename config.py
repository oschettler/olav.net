# ------------------------------------------------------------------------------
# Site Configuration File
# ------------------------------------------------------------------------------

# Choose the theme to use when building your site. This variable should specify
# the name of a theme directory in your site's 'lib' folder.
# 2024-11-11 This now runs with Ark, no longer Ivy

theme = "carbon"

title = "olav.net"

tagline = "digitalisierung. bildung. gesellschaft."

extensions = ['holly']

holly = {
    "roots": [
        {"root_url": "@root/blog//"},
    ],
    "homepage": {
        "root_urls": ["@root/blog//"],
    }
}

