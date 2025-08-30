'use client';

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";
import { QueryClientProvider, QueryClient, useMutation } from "@tanstack/react-query";
import { Label } from "./ui/label";
import { AccountStatusType, TradeHistoryType } from "@/lib/definitions";
import { syncDataToSupabaseAction } from "@/lib/actions/sync-data";


export default function SyncToMT() {

  const queryClient = new QueryClient();

  return (
    <div>
      <Card className="*:px-0 border-0 !bg-transparent">
        <CardHeader>
          <CardTitle className="text-xl">Sync Data</CardTitle>
          <CardDescription>
            Add a session provided by Fproxy and try syncing data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QueryClientProvider client={queryClient} >
            <GetData />
          </QueryClientProvider>
        </CardContent>
      </Card>
    </div>
  );
}

function GetData() {
  const [ sessionKey, setSessionKey ] = useState<string | undefined>();

  const mutation = useMutation({
    mutationKey: [ "mt-mutation" ],
    mutationFn: () => mutationFunction(sessionKey),
  });

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="session-key-input">
          Session Key
        </Label>
        <Input
          disabled={mutation.isPending}
          id="session-key-input"
          name="session-key"
          onChange={(e) => setSessionKey(e.currentTarget.value)}
          placeholder="Session Key ..."
        />
      </div>
      <Button
        disabled={mutation.isPending}
        onClick={() => {
          mutation.mutate()
        }}
      >Sync <RefreshCcw /></Button>
      <div>
        <Label className="mt-2 mb-1">Info</Label>
        {mutation.isPending && <p>Getting data from Meta Trader 4 ...</p>}
        {mutation.isError && <div className="text-red-400">ERROR: {mutation.error.message }</div>}
        {mutation.isSuccess && <div className="text-green-400">{ mutation.data }</div>}
      </div>
    </div>
  );
}

async function mutationFunction(sessionKey: string | undefined) {
  // Get data from Meta Trader
  const [ accountStatus, tradeHistory ] = await Promise.all([
    await fetchAccountStatusData(sessionKey),
    await fetchTradeHistoryData(sessionKey)
  ]).catch(error => {
      throw Error(error);
    });

  // Prepare the data
  const formData = new FormData();
  formData.append('account-status', JSON.stringify(accountStatus));
  formData.append('trade-history', JSON.stringify(tradeHistory));

  // Send the data to Supabase
  const state = await syncDataToSupabaseAction(formData);

  if (state.errors?.accountStatus) {
    state.errors.accountStatus.map(error => {
      const err = new Error();
      err.message = error;
      throw err;
    });
  }

  if (state.errors?.tradeHistory) {
    state.errors.tradeHistory.map(error => {
      const err = new Error();
      err.message = error;
      throw err;
    });
  }

  return state.message;
}

async function fetchTradeHistoryData(sessionKey: string | undefined): Promise<TradeHistoryType> {
  return fetch("http://localhost:6123/api/v1/trade-history", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "x-session-header": String(sessionKey),
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_FPROXY_API_KEY}`
    }
  }).then(data => data.json());
}

async function fetchAccountStatusData(sessionKey: string | undefined): Promise<AccountStatusType> {
  return fetch("http://localhost:6123/api/v1/account-status", {
    method: "GET",
    headers: {
      "Accept": "application/json*",
      "x-session-header": String(sessionKey),
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_FPROXY_API_KEY}` 
    }
  }).then(data => data.json())
}

