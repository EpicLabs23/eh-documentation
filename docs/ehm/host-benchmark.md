---
sidebar_position: 10
---

# Host Benchmark

Your server is usually a VPS sharing physical hardware with other customers of your provider. If the provider oversells that hardware, your accounts get slow even though EHM's own charts look normal. **Resource Monitor > Benchmark** (admin only) runs a 30–90 second test to show whether the server is being starved.

## Install the tools

```bash
apt install -y sysbench fio
```

Without them, the CPU, memory and disk tests show as "not installed"; the other checks still run.

## What it measures

| Check | What to look for |
| :--- | :--- |
| CPU steal time | Time the host withheld CPU from your server. Sustained above 5–10% means the host is oversold. The clearest single sign. |
| CPU iowait | High iowait without heavy disk use on your side suggests slow shared storage. |
| Load per core | Above about 1 for long periods means work is queuing. |
| CPU benchmark (events/sec) | Compute you actually get. Compare across runs. |
| Memory bandwidth | Drops point at memory contention from neighbours. |
| Disk IOPS and latency | Latency rising while IOPS stays flat points at contended shared storage. |
| Network latency/jitter | Secondary signal. Fails harmlessly on a firewalled server. |
| Context switches and interrupts | Secondary scheduler signal. |

## Reading the results

None of the numbers mean much on their own — they depend on your plan and provider. Instead:

1. **Steal above ~5%** on a plan sold as dedicated or guaranteed CPU is strong evidence of overselling.
2. **Run it several times at different times of day.** Results are kept, so you can compare. A server that's fine at night and struggles every evening has a noisy neighbour.
3. **Disk latency climbing while throughput stays flat** means the shared storage is the bottleneck, not your accounts.

Take the results to your provider, or move to a better host.
