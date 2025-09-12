# Changesets

The design system uses changesets to manage versioning and changelogs.

A changeset is a small piece of information that describes changes made in a branch or commit. It includes:

- What we need to release
- What version we are releasing (using a semantic versioning bump type - major, minor, patch)
- A changelog entry describing the changes

## Creating a changeset

When your PR includes changes that should be released, create a changeset by running:

```bash
pnpm changeset
```

This will prompt you for the semantic version bump type and a description of the changes. After completing the prompts,
a new changeset file will be created in the `.changeset` directory.

```
-| .changeset/
-|-| UNIQUE_ID.md
```

If you want to add more information to the changelog entry, such as code examples, you can edit the file that it created
in the `.changeset` directory. This is a markdown file with YAML frontmatter.

A pull request can have multiple changesets, if it is important to note that multiple different changes were made.

Once you have created the changeset, commit it to your branch along with your other changes. When your PR is merged, the
changeset will be picked up and included in the next release. A pull request will be automatically created to version the
package and update the changelog.

## Further reading

[You can read more information about changesets here](https://github.com/changesets/changesets/blob/main/docs/detailed-explanation.md).
