"use client";

import { useEffect } from "react";

import { RecordReplyCard } from "@/components/records/record-reply-card";
import type { GrammaticalGender } from "@/db/schema";
import { getPsychologistNoun } from "@/lib/grammatical-gender";
import { getFullName } from "@/lib/utils-app";
import { markRecordReplySeen } from "@/server/actions/record-replies";

type RecordPatientReplyProps = {
  recordId: string;
  reply: {
    content: string;
    seenAt: Date | null;
    firstName: string | null;
    lastName: string | null;
    grammaticalGender: GrammaticalGender;
  };
};

export function RecordPatientReply({ recordId, reply }: RecordPatientReplyProps) {
  const unseen = reply.seenAt === null;

  useEffect(() => {
    if (!unseen) {
      return;
    }

    void markRecordReplySeen(recordId);
  }, [recordId, unseen]);

  return (
    <RecordReplyCard
      title={`Tu ${getPsychologistNoun(reply.grammaticalGender)} ${getFullName(reply.firstName, reply.lastName)} te ha respondido`}
      content={reply.content}
      unseen={unseen}
    />
  );
}
