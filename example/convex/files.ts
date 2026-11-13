import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { fs } from "./fs";

/**
 * Commit an uploaded file to the filesystem.
 */
// oxlint-disable-next-line @convex-dev/require-access-control -- example app: the gallery is public on purpose; a real app identifies the caller first
export const commitFile = mutation({
  args: {
    blobId: v.string(),
    filename: v.string(),
    contentType: v.string(),
  },
  returns: v.object({
    path: v.string(),
  }),
  handler: async (ctx, args) => {
    // Use filename directly as path (flat directory structure)
    const path = args.filename;
    await fs.commitFiles(ctx, [{ path, blobId: args.blobId }]);
    return { path };
  },
});

/**
 * List files with pagination.
 * Compatible with usePaginatedQuery from convex-fs/react.
 */
// oxlint-disable-next-line @convex-dev/require-access-control -- example app: the gallery is public on purpose; a real app identifies the caller first
export const listFiles = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await fs.list(ctx, {
      paginationOpts: args.paginationOpts,
    });
  },
});

/**
 * Move a file to a new path.
 */
// oxlint-disable-next-line @convex-dev/require-access-control -- example app: the gallery is public on purpose; a real app identifies the caller first
export const moveFile = mutation({
  args: {
    sourcePath: v.string(),
    destPath: v.string(),
  },
  handler: async (ctx, args) => {
    await fs.move(ctx, args.sourcePath, args.destPath);
  },
});

/**
 * Copy a file to a new path.
 */
// oxlint-disable-next-line @convex-dev/require-access-control -- example app: the gallery is public on purpose; a real app identifies the caller first
export const copyFile = mutation({
  args: {
    sourcePath: v.string(),
    destPath: v.string(),
  },
  handler: async (ctx, args) => {
    await fs.copy(ctx, args.sourcePath, args.destPath);
  },
});

/**
 * Delete a file.
 */
// oxlint-disable-next-line @convex-dev/require-access-control -- example app: the gallery is public on purpose; a real app identifies the caller first
export const deleteFile = mutation({
  args: {
    path: v.string(),
  },
  handler: async (ctx, args) => {
    await fs.delete(ctx, args.path);
  },
});

/**
 * Set expiration on a file.
 * The file will be automatically deleted after the specified number of seconds.
 */
// oxlint-disable-next-line @convex-dev/require-access-control -- example app: the gallery is public on purpose; a real app identifies the caller first
export const setExpiration = mutation({
  args: {
    path: v.string(),
    expiresInSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.expiresInSeconds < 5 || args.expiresInSeconds > 3600) {
      throw new Error("Expiration must be between 5 and 3600 seconds");
    }

    const file = await fs.stat(ctx, args.path);
    if (!file) {
      throw new Error("File not found");
    }

    const expiresAt = Date.now() + args.expiresInSeconds * 1000;

    await fs.transact(ctx, [
      {
        op: "setAttributes",
        source: file,
        attributes: { expiresAt },
      },
    ]);
  },
});
