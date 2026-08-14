'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Calendar, User } from 'lucide-react';
import { ActionItem, ActionStatus, Participant } from '@/types';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ActionItemListProps {
  meetingId: number;
  actionItems: ActionItem[];
  participants: Participant[];
  isLoading: boolean;
}

export default function ActionItemList({
  meetingId,
  actionItems,
  participants,
  isLoading,
}: ActionItemListProps) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState<number | undefined>(undefined);
  const [newDueDate, setNewDueDate] = useState('');

  // Mutation for updating status (optimistic update pattern)
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ActionStatus }) =>
      api.updateActionItem(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['actionItems', meetingId] });
      const previousActions = queryClient.getQueryData<ActionItem[]>(['actionItems', meetingId]);

      if (previousActions) {
        queryClient.setQueryData<ActionItem[]>(
          ['actionItems', meetingId],
          previousActions.map((a) => (a.id === id ? { ...a, status } : a))
        );
      }

      return { previousActions };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousActions) {
        queryClient.setQueryData(['actionItems', meetingId], context.previousActions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', meetingId] });
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: { title: string; assignee_id?: number; due_date?: string }) =>
      api.createActionItem(meetingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', meetingId] });
      setNewTitle('');
      setIsCreating(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteActionItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', meetingId] });
    },
  });

  const handleToggleComplete = (action: ActionItem) => {
    const nextStatus: ActionStatus =
      action.status === 'completed' ? 'pending' : 'completed';
    updateMutation.mutate({ id: action.id, status: nextStatus });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createMutation.mutate({
      title: newTitle.trim(),
      assignee_id: newAssigneeId,
      due_date: newDueDate || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Action Items</h3>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1 text-xs font-semibold text-[#7C4DFF] hover:text-[#6F3FF0] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Inline Create Form */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
          <input
            type="text"
            required
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Action item description..."
            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:border-[#7C4DFF] focus:outline-hidden"
          />

          <div className="flex items-center gap-2">
            <select
              value={newAssigneeId || ''}
              onChange={(e) => setNewAssigneeId(e.target.value ? Number(e.target.value) : undefined)}
              className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[11px] text-gray-700"
            >
              <option value="">Assignee (Optional)</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-[11px] text-gray-700"
            />

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="ml-auto px-3 py-1 bg-[#7C4DFF] text-white text-xs font-semibold rounded-lg hover:bg-[#6F3FF0]"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {actionItems.length === 0 ? (
        <p className="text-xs text-gray-400">No action items created for this meeting.</p>
      ) : (
        <div className="space-y-2">
          {actionItems.map((action) => {
            const isCompleted = action.status === 'completed';
            return (
              <div
                key={action.id}
                className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isCompleted
                    ? 'bg-gray-50/70 border-gray-200 opacity-75'
                    : 'bg-white border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(action)}
                    className="mt-0.5 text-gray-400 hover:text-[#7C4DFF] transition-colors flex-shrink-0"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium text-gray-900 leading-snug ${
                        isCompleted ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {action.title}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap">
                      {action.assignee && (
                        <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          <User className="w-2.5 h-2.5" />
                          {action.assignee.name}
                        </span>
                      )}

                      {action.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-gray-400" />
                          Due {action.due_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteMutation.mutate(action.id)}
                  title="Delete action item"
                  className="text-gray-300 hover:text-red-600 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
